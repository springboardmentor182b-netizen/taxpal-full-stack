const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { email, name, country } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required.' });
    }
    // Check if user already exists
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    const user = new User({
      email: email.trim().toLowerCase(),
      name,
      country
    });
    await user.save();
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Sign-in route: POST /api/users/signin
router.post('/signin', async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    email = email.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found' });
    }
    // Return user data with _id for client-side storage
    res.status(200).json({
      message: 'Sign in successful',
      user: {
        _id: user._id, // <-- include MongoDB ObjectId
        email: user.email,
        name: user.name,
        initial: (user.name && user.name.trim()) ? user.name.trim()[0].toUpperCase() : user.email[0].toUpperCase()
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/me
router.get('/me', async (req, res) => {
  try {
    // For demo: return the first user in the database
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ error: 'No user found' });
    }
    
    res.json({ 
      name: user.name, 
      email: user.email,
      // Add initial for avatar
      initial: (user.name && user.name.trim()) ? user.name.trim()[0].toUpperCase() : user.email[0].toUpperCase()
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/add-income
router.post('/add-income', async (req, res) => {
  try {
    const { title, amount, category, date, notes, userEmail } = req.body;
    if (!title || !amount || !date || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const income = new Income({
      title,
      amount,
      category,
      date,
      notes,
      userEmail: userEmail.trim().toLowerCase()
    });
    await income.save();
    res.status(201).json({ message: 'Income added', income });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /api/users/add-expense
router.post('/add-expense', async (req, res) => {
  try {
    const { title, amount, category, date, notes, taxDeductible, userEmail } = req.body;
    if (!title || !amount || !date || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const expense = new Expense({
      title,
      amount,
      category,
      date,
      notes,
      taxDeductible,
      userEmail: userEmail.trim().toLowerCase()
    });
    await expense.save();
    res.status(201).json({ message: 'Expense added', expense });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /api/users/create-budget
router.post('/create-budget', async (req, res) => {
  try {
    const { category, limit, month, description } = req.body;
    if (!category || !limit || !month) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Do not require user_id
    const budget = new Budget({
      category,
      limit,
      month,
      description
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /api/users/budgets
router.get('/budgets', async (req, res) => {
  try {
    // Return all budgets, no user_id filter
    const budgets = await Budget.find().sort({ month: -1, createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json([]);
  }
});

module.exports = router;

// Make sure this file is loaded in your Express app:
// In your main server file (e.g. app.js or server.js):
// const userRoutes = require('./routes/user');
// app.use('/api/users', userRoutes);