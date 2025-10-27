const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const SimpleBudget = require('../models/SimpleBudget');
const Category = require('../models/Category');
const mongoose = require('mongoose');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and management
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: user@example.com
 *             name: John Doe
 *             password: securepassword123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: User already exists or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * /api/users/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           example:
 *             email: user@example.com
 *             password: securepassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */

// Sign-in route: POST /api/users/signin
router.post('/signin', async (req, res) => {
  try {
    let { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    email = email.trim().toLowerCase();

    // Find the user - use lean() for faster queries that don't need Mongoose methods
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ error: 'No account found' });
    }
    
    // Get the full user document only for password verification
    const fullUser = await User.findById(user._id);
    const isPasswordMatch = await fullUser.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    
    // Return user data (exclude password)
    const { password: _, ...userData } = user;
    
    res.status(200).json({ 
      message: 'Sign in successful', 
      user: {
        ...userData,
        initial: (userData.name && userData.name.trim()) ? userData.name.trim()[0].toUpperCase() : userData.email[0].toUpperCase()
      }
    });
  } catch (err) {
    console.error('[DEBUG] Sign-in error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/users/update-profile:
 *   post:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */

// GET /api/users/me
router.get('/me', async (req, res) => {
  try {
    // Get user email from query parameter instead of returning first user
    const userEmail = req.query.email;
    
    if (!userEmail) {
      console.log('[DEBUG] /me: No email provided');
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    
    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log('[DEBUG] /me: No user found for email', userEmail);
      return res.status(404).json({ error: 'No user found' });
    }
    
    console.log('[DEBUG] /me: Returning user', user.email);
    res.json({ 
      name: user.name, 
      email: user.email,
      _id: user._id,
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
    
    // Simplified validation
    if (!title || !amount) {
      return res.status(400).json({ error: 'Title and amount are required' });
    }
    
    const income = new Income({
      title,
      amount: parseFloat(amount), // Ensure numeric
      category,
      date: date || new Date(), // Default to today if not provided
      notes,
      userEmail: userEmail.trim().toLowerCase()
    });
    
    await income.save();
    
    // Return minimal response
    res.status(201).json({ 
      message: 'Income added', 
      income 
    });
  } catch (err) {
    console.error('[DEBUG] Add income error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /api/users/add-expense
router.post('/add-expense', async (req, res) => {
  try {
    const { title, amount, category, date, notes, taxDeductible, userEmail } = req.body;
    
    // Simplified validation
    if (!title || !amount) {
      return res.status(400).json({ error: 'Title and amount are required' });
    }
    
    const expense = new Expense({
      title,
      amount: parseFloat(amount), // Ensure numeric
      category,
      date: date || new Date(), // Default to today if not provided
      notes,
      taxDeductible,
      userEmail: userEmail.trim().toLowerCase()
    });
    
    await expense.save();
    
    // Return minimal response
    res.status(201).json({ 
      message: 'Expense added', 
      expense 
    });
  } catch (err) {
    console.error('[DEBUG] Add expense error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

/**
 * @route   POST /api/users/add-simple-budget
 * @desc    Add a new simple budget
 */
router.post('/add-simple-budget', async (req, res) => {
  try {
    const { amount, category, date, description, userEmail } = req.body;
    
    // Validate required fields
    if (!amount || !userEmail) {
      return res.status(400).json({ error: 'Amount and user email are required' });
    }
    
    // Create a new simple budget
    const simpleBudget = new SimpleBudget({
      userEmail: userEmail.toLowerCase(),
      amount,
      category: category || 'General',
      date: date ? new Date(date) : new Date(),
      description
    });
    
    // Save the budget
    const budget = await simpleBudget.save();
    
    return res.status(201).json({ 
      message: 'Budget added successfully!', 
      budget 
    });
  } catch (err) {
    console.error('Error adding budget:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/users/simple-budget-list
 * @desc    Get simple budgets for a user
 */
router.get('/simple-budget-list', async (req, res) => {
  try {
    const { userEmail } = req.query;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    
    // Find budgets for this specific user, sorted by date (newest first)
    const budgets = await SimpleBudget.find({ userEmail: userEmail.toLowerCase() })
      .sort({ date: -1, createdAt: -1 })
      .lean();
    
    return res.json(budgets);
  } catch (err) {
    console.error('Error fetching budgets:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/income-list - Optimized with pagination and limit
router.get('/income-list', async (req, res) => {
  try {
    const userEmail = (req.query.userEmail || '').trim().toLowerCase();
    const limit = parseInt(req.query.limit) || 50; // Default to 50 items
    
    if (!userEmail) return res.status(400).json([]);
    
    // Use lean() for faster queries
    const incomeList = await Income.find({ userEmail })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .lean();
      
    res.json(incomeList);
  } catch (err) {
    console.error('[DEBUG] Income list error:', err);
    res.status(500).json([]);
  }
});

// GET /api/users/expense-list - Optimized with pagination and limit
router.get('/expense-list', async (req, res) => {
  try {
    const userEmail = (req.query.userEmail || '').trim().toLowerCase();
    const limit = parseInt(req.query.limit) || 50; // Default to 50 items
    
    if (!userEmail) return res.status(400).json([]);
    
    // Use lean() for faster queries
    const expenseList = await Expense.find({ userEmail })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .lean();
      
    res.json(expenseList);
  } catch (err) {
    console.error('[DEBUG] Expense list error:', err);
    res.status(500).json([]);
  }
});

// Update profile: POST /api/users/update-profile
router.post('/update-profile', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user name
    user.name = name || user.name;
    
    // Save the updated user
    await user.save();
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: {
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update password: POST /api/users/update-password
router.post('/update-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    
    // Save the updated user
    await user.save();
    
    res.status(200).json({ 
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============= CATEGORY ROUTES =============

/**
 * @route   GET /api/users/categories/:userId
 * @desc    Get all categories for a specific user by ID
 */
router.get('/categories/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Find the user to get their name
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const categories = await Category.find({ userId });
    
    // If categories exist but don't have userName, add it
    if (categories.length > 0 && user && !categories[0].userName) {
      const userName = user.name || 'User';
      await Category.updateMany({ userId }, { $set: { userName } });
    }
    
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/users/categories-by-email/:email
 * @desc    Get all categories for a specific user by email
 */
router.get('/categories-by-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find user first to get user ID
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find categories with the user's ID
    const categories = await Category.find({ userId: user._id });
    
    // If categories exist but don't have userName, add it
    if (categories.length > 0 && !categories[0].userName) {
      const userName = user.name || 'User';
      await Category.updateMany({ userId: user._id }, { $set: { userName } });
    }
    
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories by email:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/users/categories
 * @desc    Create a new category
 */
router.post('/categories', async (req, res) => {
  try {
    const { userId, userName, name, type, color } = req.body;
    
    if (!userId || !name || !type) {
      return res.status(400).json({ message: 'User ID, name, and type are required' });
    }
    
    // Find user to get name if not provided
    let userNameToUse = userName || 'User';
    if (!userName) {
      const user = await User.findById(userId);
      if (user) {
        userNameToUse = user.name || 'User';
      }
    }
    
    // Create new category
    const category = new Category({
      userId,
      userName: userNameToUse,
      name: name.trim(),
      type,
      color: color || undefined
    });
    
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }
    
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/users/categories/batch
 * @desc    Create or update multiple categories at once
 */
router.post('/categories/batch', async (req, res) => {
  try {
    const { categories } = req.body;
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Categories must be a non-empty array' });
    }
    
    // Get userId from the first category for validation
    const userId = categories[0]?.userId;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID' });
    }
    
    // Find user to get name if not provided
    let userName = categories[0]?.userName || 'User';
    if (!userName || userName === 'User') {
      const user = await User.findById(userId);
      if (user) {
        userName = user.name || 'User';
      }
    }
    
    // First, remove all existing categories for this specific user
    await Category.deleteMany({ userId });
    
    // Then create all new categories for this specific user
    const savedCategories = await Category.insertMany(
      categories.map(cat => ({
        userId,
        userName,
        name: cat.name.trim(),
        type: cat.type,
        color: cat.color || undefined
      }))
    );
    
    return res.status(201).json({ message: 'Categories saved successfully', categories: savedCategories });
  } catch (error) {
    console.error('Error saving categories batch:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   DELETE /api/users/categories/:id
 * @desc    Delete a category
 */
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }
    
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully', category: deletedCategory });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // Delete single income record
router.delete('/delete-income/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.query;

    if (!id || !userEmail) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = await Income.findOneAndDelete({ _id: id, userEmail });
    
    if (!result) {
      return res.status(404).json({ error: 'Income record not found' });
    }

    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({ error: 'Failed to delete income' });
  }
});

// Delete all income records for a user
router.delete('/delete-all-income', async (req, res) => {
  try {
    const { userEmail } = req.query;
    await Income.deleteMany({ userEmail });
    res.json({ message: 'All income records deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete income records' });
  }
});

// Delete single expense record
router.delete('/delete-expense/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.query;

    if (!id || !userEmail) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const expense = await Expense.findOneAndDelete({ _id: id, userEmail });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense record not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Delete all expense records for a user
router.delete('/delete-all-expenses', async (req, res) => {
  try {
    const { userEmail } = req.query;
    await Expense.deleteMany({ userEmail });
    res.json({ message: 'All expense records deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense records' });
  }
});

// Delete a budget by ID and userEmail
router.delete('/delete-budget/:id', async (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.query;
  if (!id || !userEmail) {
    return res.status(400).json({ message: 'Budget ID and user email required' });
  }
  try {
    const deleted = await SimpleBudget.findOneAndDelete({ _id: id, userEmail });
    if (!deleted) {
      return res.status(404).json({ message: 'Budget not found or not authorized' });
    }
    res.json({ message: 'Budget deleted', budget: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting budget', error: err.message });
  }
});


module.exports = router;