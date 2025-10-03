const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories for a user
router.get('/:userId', async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.params.userId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { userId, name, type, color } = req.body;
    
    // Basic validation
    if (!userId || !name || !type) {
      return res.status(400).json({ message: 'UserId, name and type are required' });
    }
    
    // Create new category
    const category = new Category({
      userId,
      name,
      type,
      color
    });
    
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    // Check if error is a duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists for this user' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted', category: deletedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
