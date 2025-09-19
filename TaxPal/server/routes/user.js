const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      console.log('No email provided');
      return res.status(400).json({ error: 'Email is required' });
    }

    // Register user in main users collection
    const user = new User({ email, name });
    await user.save();

    // ...existing code for per-user DB...

    res.status(201).json({ message: 'User registered and database created', user });
  } catch (err) {
    console.error('Registration backend error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
