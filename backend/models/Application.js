const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM applications", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.post("/", (req, res) => {
  const { company, role, status, applied_date, notes } = req.body;
  db.query(
    "INSERT INTO applications (company, role, status, applied_date, notes) VALUES (?, ?, ?, ?, ?)",
    [company, role, status, applied_date, notes],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Application added" });
    }
  );
});

router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM applications WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
});

module.exports = router;
