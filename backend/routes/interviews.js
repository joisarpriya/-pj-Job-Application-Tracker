const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET interviews
router.get("/", (req, res) => {
  const sql = "SELECT * FROM interviews ORDER BY interview_date ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ADD interview
router.post("/", (req, res) => {
  const { company, date, round } = req.body;
  const sql =
    "INSERT INTO interviews (company, date, round) VALUES (?, ?, ?)";
  db.query(sql, [company, date, round], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId });
  });
});

module.exports = router;

