const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Get all categories for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Find categories for this user
    const categories = await Category.find({ userId });
    
    // Group categories by type
    const incomeCategories = categories.filter(cat => cat.type === 'income');
    const expenseCategories = categories.filter(cat => cat.type === 'expense');
    
    res.status(200).json({ 
      success: true,
      data: {
        incomeCategories,
        expenseCategories
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { userId, name, type, color } = req.body;
    
    // Basic validation
    if (!userId || !name || !type) {
      return res.status(400).json({ message: 'Missing required fields: userId, name, type' });
    }
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Validate type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "income" or "expense"' });
    }
    
    // Create new category
    const newCategory = new Category({
      userId,
      name,
      type,
      color: color || undefined // Use default if not provided
    });
    
    const savedCategory = await newCategory.save();
    res.status(201).json({ success: true, data: savedCategory });
    
  } catch (error) {
    // Check if error is a duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Category with this name already exists for this user and type' 
      });
    }
    
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create multiple categories at once
router.post('/batch', async (req, res) => {
  try {
    const { userId, categories } = req.body;
    
    // Basic validation
    if (!userId || !categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ 
        message: 'Invalid request. Provide userId and an array of categories' 
      });
    }
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // First, delete existing categories for this user
    await Category.deleteMany({ userId });
    
    // Prepare categories with userId
    const preparedCategories = categories.map(cat => ({
      userId,
      name: cat.name,
      type: cat.type,
      color: cat.color || undefined // Use default if not provided
    }));
    
    // Insert all categories
    const savedCategories = await Category.insertMany(preparedCategories);
    
    res.status(201).json({ 
      success: true, 
      message: 'Categories saved successfully',
      count: savedCategories.length
    });
    
  } catch (error) {
    console.error('Error creating batch categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { name, color } = req.body;
    const categoryId = req.params.id;
    
    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId, 
      { name, color }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json({ success: true, data: updatedCategory });
    
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }
    
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;