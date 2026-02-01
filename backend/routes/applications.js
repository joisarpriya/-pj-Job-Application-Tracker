const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM applications ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { company, role, status, applied_date, notes } = req.body;

  db.query(
    `INSERT INTO applications (company, role, status, applied_date, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [company, role, status, applied_date, notes],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

router.put("/:id", (req, res) => {
  const { status } = req.body;
  const sql = "UPDATE applications SET status=? WHERE id=?";
  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});


router.delete("/:id", (req, res) => {
  db.query("DELETE FROM applications WHERE id=?", [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

module.exports = router;
