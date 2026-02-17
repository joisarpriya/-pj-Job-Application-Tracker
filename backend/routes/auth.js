const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'dev-secret-applyflow';

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'name, email and password required' });

  try {
    db.query('SELECT id FROM users WHERE email=?', [email], async (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (rows && rows.length > 0) return res.status(400).json({ error: 'Email already registered' });

      const hash = await bcrypt.hash(password, 10);
      db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hash, role || 'student'], (err, result) => {
        if (err) return res.status(500).json({ error: 'DB insert failed' });
        const user = { id: result.insertId, name, email, role: role || 'student' };
        const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
        res.json({ token, user });
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  db.query('SELECT id, name, email, password, role FROM users WHERE email=?', [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!rows || rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const user = { id: userRow.id, name: userRow.name, email: userRow.email, role: userRow.role };
    const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  });
});

// get current user
const auth = require('../middleware/auth');
router.get('/me', auth, (req, res) => {
  const user = req.user;
  // Get latest data from DB
  db.query('SELECT id, name, email, role FROM users WHERE id=?', [user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  });
});

module.exports = router;
