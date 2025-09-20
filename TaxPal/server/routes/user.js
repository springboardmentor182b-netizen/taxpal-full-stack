const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');

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

    res.status(201).json({ 
      message: 'User registered and database created', 
      user: {
        email: user.email,
        name: user.name,
        // Add avatar initial based on email or name
        initial: (user.name && user.name.trim()) ? user.name.trim()[0].toUpperCase() : user.email[0].toUpperCase()
      }
    });
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
    
    // Return user data with avatar initial
    res.status(200).json({ 
      message: 'Sign in successful', 
      user: {
        email: user.email,
        name: user.name,
        // Priority: name first letter, then email first letter
        initial: (user.name && user.name.trim()) ? user.name.trim()[0].toUpperCase() : user.email[0].toUpperCase()
      }
    });
  } catch (err) {
    console.error('Sign-in error:', err);
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

// GET /api/users/income-list?userEmail=...
router.get('/income-list', async (req, res) => {
  try {
    const userEmail = (req.query.userEmail || '').trim().toLowerCase();
    if (!userEmail) return res.status(400).json([]);
    const incomeList = await Income.find({ userEmail }).sort({ date: -1, createdAt: -1 });
    res.json(incomeList);
  } catch (err) {
    res.status(500).json([]);
  }
});

// GET /api/users/expense-list?userEmail=...
router.get('/expense-list', async (req, res) => {
  try {
    const userEmail = (req.query.userEmail || '').trim().toLowerCase();
    if (!userEmail) return res.status(400).json([]);
    const expenseList = await Expense.find({ userEmail }).sort({ date: -1, createdAt: -1 });
    res.json(expenseList);
  } catch (err) {
    res.status(500).json([]);
  }
});

module.exports = router;