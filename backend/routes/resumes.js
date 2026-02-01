const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db");
const ai = require("../ai/agent");

const uploadDir = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// Upload and analyze resume (optional auth)
const auth = require('../middleware/auth');
router.post("/upload", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const mimetype = req.file.mimetype;

    const analysis = await ai.analyzeResumeFromFile(filePath, mimetype);
    const score = analysis.overall.total;
    const userId = req.user?.id || null;

    db.query(
      "INSERT INTO resumes (user_id, file_path, parsed_text, score, analysis) VALUES (?, ?, ?, ?, ?)",
      [userId, filePath, analysis.parsedText, score, JSON.stringify(analysis)],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "DB error" });
        }
        res.json({ id: result.insertId, score, analysis });
      }
    );
  } catch (err) {
    console.error("Upload analyze failed:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// List recent resumes
router.get("/", (req, res) => {
  db.query("SELECT id, user_id, file_path, score, created_at FROM resumes ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Get single analysis
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM resumes WHERE id=?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Not found" });
    try {
      rows[0].analysis = JSON.parse(rows[0].analysis);
    } catch (e) {}
    res.json(rows[0]);
  });
});

// Suggest fixes for a given section
router.post("/suggest", (req, res) => {
  const { section } = req.body;
  if (!section) return res.status(400).json({ error: "section required" });
  try {
    const suggestions = ai.suggestForSection(section);
    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Suggest failed" });
  }
});

module.exports = router;
