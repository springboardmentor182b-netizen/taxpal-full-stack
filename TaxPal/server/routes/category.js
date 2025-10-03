const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const User = require('../models/User');

// Get all categories for a user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find categories for this user
    const categories = await Category.find({ user: userId });
    
    // Group categories by type
    const incomeCategories = categories.filter(cat => cat.type === 'income');
    const expenseCategories = categories.filter(cat => cat.type === 'expense');
    
    res.status(200).json({ incomeCategories, expenseCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save categories for a user
router.post('/save', async (req, res) => {
  try {
    const { userId, incomeCategories, expenseCategories } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (!Array.isArray(incomeCategories) || !Array.isArray(expenseCategories)) {
      return res.status(400).json({ message: 'Categories must be arrays' });
    }
    
    // Validate each category has a name
    const allCategoriesValid = [...incomeCategories, ...expenseCategories]
      .every(cat => cat && typeof cat.name === 'string' && cat.name.trim().length > 0);
      
    if (!allCategoriesValid) {
      return res.status(400).json({ message: 'All categories must have valid names' });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete existing categories for this user
    await Category.deleteMany({ user: userId });
    
    // Prepare categories for insertion
    const categoriesToInsert = [
      ...incomeCategories.map(cat => ({
        user: userId,
        type: 'income',
        name: cat.name,
        color: cat.color || null
      })),
      ...expenseCategories.map(cat => ({
        user: userId,
        type: 'expense',
        name: cat.name,
        color: cat.color || null
      }))
    ];
    
    // Insert new categories
    if (categoriesToInsert.length > 0) {
      await Category.insertMany(categoriesToInsert);
    }
    
    res.status(201).json({ 
      message: 'Categories saved successfully',
      incomeCount: incomeCategories.length,
      expenseCount: expenseCategories.length
    });
  } catch (error) {
    console.error('Error saving categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
