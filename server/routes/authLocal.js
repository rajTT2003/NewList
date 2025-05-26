const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/signup
router.post('/api/signup', async (req, res) => {
  let { name, email, password } = req.body;

  try {
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    email = email.trim().toLowerCase();
    if (!validator.isEmail(email))
      return res.status(400).json({ message: 'Invalid email format' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/login
router.post('/api/login', async (req, res) => {
  let { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/me (Protected route)
router.get('/api/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
