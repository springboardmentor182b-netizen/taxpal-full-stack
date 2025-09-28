const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['food', 'utilities', 'transportation', 'entertainment', 'healthcare', 'shopping', 'education', 'travel', 'other']
  },
  limit: { 
    type: Number, 
    required: true,
    min: 0
  },
  month: { 
    type: String, 
    required: true,
    match: /^\d{4}-\d{2}$/ // Format: YYYY-MM
  },
  description: { 
    type: String,
    maxlength: 500
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
BudgetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
BudgetSchema.index({ user_id: 1, month: 1 });
BudgetSchema.index({ user_id: 1, category: 1 });

module.exports = mongoose.model('Budget', BudgetSchema);
