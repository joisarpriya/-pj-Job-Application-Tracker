const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total,
      SUM(status='Applied') AS applied,
      SUM(status='Interview') AS interview,
      SUM(status='Offer') AS offer,
      SUM(status='Rejected') AS rejected
    FROM applications
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

module.exports = router;
