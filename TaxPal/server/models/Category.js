const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for performance
  },
  userName: {
    type: String,
    default: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  color: {
    type: String,
    default: '#3b82f6' // Default color (blue)
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create a compound index for userId, name, and type to ensure uniqueness
// This prevents duplicate categories for the same user - ensure uniqueness per user!
CategorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);
