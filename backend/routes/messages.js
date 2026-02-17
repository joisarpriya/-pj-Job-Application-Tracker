const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// send message
router.post('/', auth, (req, res) => {
  const sender = req.user.id;
  const { receiver_id, message } = req.body;
  if (!receiver_id || !message) return res.status(400).json({ error: 'receiver_id and message required' });

  db.query('INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)', [sender, receiver_id, message], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ id: result.insertId });
  });
});

// get conversation with a user
router.get('/:withId', auth, (req, res) => {
  const userId = req.user.id;
  const withId = req.params.withId;
  db.query('SELECT * FROM messages WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?) ORDER BY created_at ASC', [userId, withId, withId, userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

module.exports = router;
