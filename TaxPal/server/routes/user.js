const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const SimpleBudget = require('../models/SimpleBudget');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { email, name, country, password } = req.body;
    console.log('[DEBUG] Register attempt for:', email);
    
    if (!email || !name || !password) {
      console.log('[DEBUG] Register failed: Email, name and password required');
      return res.status(400).json({ error: 'Email, name and password are required.' });
    }
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.log('[DEBUG] Register failed: Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Password validation
    if (password.length < 8) {
      console.log('[DEBUG] Register failed: Password too short');
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    // Check if user already exists
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      console.log('[DEBUG] Register failed: User already exists for', email);
      return res.status(409).json({ error: 'User already exists.' });
    }
    
    const user = new User({
      email: email.trim().toLowerCase(),
      name,
      country,
      password
    });
    
    await user.save();
    console.log('[DEBUG] Register successful for:', email);
    
    // Don't return password in the response
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      country: user.country
    };
    
    res.status(201).json({ message: 'User registered', user: userResponse });
  } catch (err) {
    console.error('[DEBUG] Register error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Sign-in route: POST /api/users/signin
router.post('/signin', async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      console.log('[DEBUG] Sign-in failed: No email provided');
      return res.status(400).json({ error: 'Email is required' });
    }
    email = email.trim().toLowerCase();

    console.log('[DEBUG] Sign-in attempt for:', email);

    // Explicitly search in the default database's users collection
    const user = await User.findOne({ email });
    if (!user) {
      console.log('[DEBUG] Sign-in failed: No account found for', email);
      return res.status(404).json({ error: 'No account found' });
    }
    
    console.log('[DEBUG] Sign-in successful for:', email);
    
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
    console.error('[DEBUG] Sign-in error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/me
router.get('/me', async (req, res) => {
  try {
    // For demo: return the first user in the database
    const user = await User.findOne();
    if (!user) {
      console.log('[DEBUG] /me: No user found');
      return res.status(404).json({ error: 'No user found' });
    }
    console.log('[DEBUG] /me: Returning user', user.email);
    res.json({ 
      name: user.name, 
      email: user.email,
      // Add initial for avatar
      initial: (user.name && user.name.trim()) ? user.name.trim()[0].toUpperCase() : user.email[0].toUpperCase()
    });
  } catch (err) {
    console.error('[DEBUG] /me error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/add-income
router.post('/add-income', async (req, res) => {
  try {
    const { title, amount, category, date, notes, userEmail } = req.body;
    console.log('[DEBUG] Add income attempt:', { title, amount, category, userEmail });
    if (!title || !amount || !date || !userEmail) {
      console.log('[DEBUG] Add income failed: Missing required fields');
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
    console.log('[DEBUG] Income added for:', userEmail);
    res.status(201).json({ message: 'Income added', income });
  } catch (err) {
    console.error('[DEBUG] Add income error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /api/users/add-expense
router.post('/add-expense', async (req, res) => {
  try {
    const { title, amount, category, date, notes, taxDeductible, userEmail } = req.body;
    console.log('[DEBUG] Add expense attempt:', { title, amount, category, userEmail });
    if (!title || !amount || !date || !userEmail) {
      console.log('[DEBUG] Add expense failed: Missing required fields');
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
    console.log('[DEBUG] Expense added for:', userEmail);
    res.status(201).json({ message: 'Expense added', expense });
  } catch (err) {
    console.error('[DEBUG] Add expense error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /api/users/add-simple-budget
router.post('/add-simple-budget', async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
      return res.status(400).json({ error: 'Amount is required and must be a non-negative number.' });
    }
    
    // Create budget with all fields
    const budget = new SimpleBudget({ 
      amount, 
      category: category || 'General',
      date: date ? new Date(date) : new Date(),
      description: description || ''
    });
    
    await budget.save();
    res.status(201).json({ message: 'Budget added', budget });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /api/users/income-list?userEmail=...
router.get('/income-list', async (req, res) => {
  try {
    const userEmail = (req.query.userEmail || '').trim().toLowerCase();
    console.log('[DEBUG] Fetch income list for:', userEmail);
    if (!userEmail) return res.status(400).json([]);
    const incomeList = await Income.find({ userEmail }).sort({ date: -1, createdAt: -1 });
    res.json(incomeList);
  } catch (err) {
    console.error('[DEBUG] Income list error:', err);
    res.status(500).json([]);
  }
});

// GET /api/users/expense-list?userEmail=...
router.get('/expense-list', async (req, res) => {
  try {
    const userEmail = (req.query.userEmail || '').trim().toLowerCase();
    console.log('[DEBUG] Fetch expense list for:', userEmail);
    if (!userEmail) return res.status(400).json([]);
    const expenseList = await Expense.find({ userEmail }).sort({ date: -1, createdAt: -1 });
    res.json(expenseList);
  } catch (err) {
    console.error('[DEBUG] Expense list error:', err);
    res.status(500).json([]);
  }
});

// GET /api/users/simple-budget-list
router.get('/simple-budget-list', async (req, res) => {
  try {
    const budgets = await SimpleBudget.find().sort({ createdAt: -1 });
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