const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    let { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    email = email.trim().toLowerCase();

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

// Sign-in route: POST /api/users/signin
router.post('/signin', async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      console.log('Sign-in failed: No email provided');
      return res.status(400).json({ error: 'Email is required' });
    }
    email = email.trim().toLowerCase();

    console.log('Sign-in attempt for:', email);

    // Explicitly search in the default database's users collection
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Sign-in failed: No account found for', email);
      return res.status(404).json({ error: 'No account found' });
    }
    console.log('Sign-in successful for:', email);
    res.status(200).json({ message: 'Sign in successful', user });
  } catch (err) {
    console.error('Sign-in error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
