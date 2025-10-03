// This file is now empty as all category routes have been moved to user.js
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');

// Get all categories for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const categories = await Category.find({ userId });
    
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { userId, name, type, color } = req.body;
    
    if (!userId || !name || !type) {
      return res.status(400).json({ message: 'User ID, name, and type are required' });
    }
    
    // Create new category
    const category = new Category({
      userId,
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

// Batch create/update categories
router.post('/batch', async (req, res) => {
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
    
    // First, remove all existing categories for this user
    await Category.deleteMany({ userId });
    
    // Then create all new categories
    const savedCategories = await Category.insertMany(
      categories.map(cat => ({
        userId,
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

// Delete a category
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
    
    res.json({ message: 'Category deleted successfully', category: deletedCategory });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
