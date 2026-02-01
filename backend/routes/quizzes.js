const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Submit quiz results
router.post('/submit', auth, (req, res) => {
  const userId = req.user.id;
  const results = req.body.results;
  if (!results) return res.status(400).json({ error: 'results required' });

  db.query('INSERT INTO resume_quizzes (user_id, results) VALUES (?, ?)', [userId, JSON.stringify(results)], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ id: result.insertId });
  });
});

// Get my quizzes
router.get('/me', auth, (req, res) => {
  const userId = req.user.id;
  db.query('SELECT * FROM resume_quizzes WHERE user_id=? ORDER BY created_at DESC', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows.map(r => ({ ...r, results: JSON.parse(r.results) })));
  });
});

module.exports = router;
