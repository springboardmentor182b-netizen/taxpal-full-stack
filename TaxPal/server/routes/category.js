const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Get all categories for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const categories = await Category.find({ userId });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or update categories
router.post('/', async (req, res) => {
  try {
    const { categories } = req.body;
    
    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ message: 'Categories must be an array' });
    }
    
    // Extract userId from the first category
    const userId = categories[0]?.userId;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID' });
    }
    
    // Delete existing categories for this user (to replace with new set)
    await Category.deleteMany({ userId });
    
    // Create new categories
    const savedCategories = await Category.insertMany(
      categories.map(cat => ({
        userId,
        name: cat.name,
        type: cat.type,
        color: cat.color || undefined
      }))
    );
    
    res.status(201).json({ 
      message: 'Categories saved successfully',
      categories: savedCategories
    });
  } catch (error) {
    console.error('Error saving categories:', error);
    
    // Special handling for duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate category name found. Each category name must be unique.'
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a specific category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }
    
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
