const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Simple matching engine
router.post('/', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    // latest resume
    const resumeRows = await new Promise((resolve, reject) => db.query('SELECT * FROM resumes WHERE user_id=? ORDER BY created_at DESC LIMIT 1', [userId], (err, rows) => err ? reject(err) : resolve(rows)));
    if (!resumeRows || resumeRows.length === 0) return res.status(400).json({ error: 'No resume found' });
    const resume = resumeRows[0];
    let analysis = {};
    try { analysis = JSON.parse(resume.analysis); } catch (e) { analysis = resume.analysis || {}; }

    // get internships
    const internships = await new Promise((resolve, reject) => db.query('SELECT * FROM internships', (err, rows) => err ? reject(err) : resolve(rows)));

    const results = internships.map((intern) => {
      const skillsReq = (intern.skills_required || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

      // compute best role match
      let bestRole = null;
      let bestScore = 0;
      for (const [role, info] of Object.entries(analysis.skillsAnalysis || {})) {
        const matches = (info.matches || []).map(m => m.toLowerCase());
        const overlap = skillsReq.filter(s => matches.includes(s)).length;
        const skillMatchPct = skillsReq.length ? Math.round((overlap / skillsReq.length) * 100) : 0;
        const combined = Math.round((skillMatchPct * 0.7) + (info.score * 0.3));
        if (combined > bestScore) { bestScore = combined; bestRole = role; }
      }

      const resumeScore = analysis.overall?.total || 0;
      const matchPercent = Math.round((bestScore * 0.6) + (resumeScore * 0.4));

      return {
        internship: intern,
        match: matchPercent,
        reason: `Matched on role ${bestRole} with estimated fit ${bestScore}% and resume score ${resumeScore}%`,
      };
    }).sort((a,b) => b.match - a.match);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Match failed' });
  }
});

module.exports = router;
