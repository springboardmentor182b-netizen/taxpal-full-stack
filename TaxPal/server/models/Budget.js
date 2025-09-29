const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  // user_id is now optional
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: {
      values: ['food', 'utilities', 'transportation', 'entertainment', 'healthcare', 'shopping', 'education', 'travel', 'other'],
      message: '{VALUE} is not a valid category'
    },
    trim: true,
    lowercase: true // Ensure consistency
  },
  limit: { 
    type: Number, 
    required: [true, 'Budget limit is required'],
    min: [0, 'Budget limit cannot be negative'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value >= 0;
      },
      message: 'Budget limit must be a valid positive number'
    }
  },
  month: { 
    type: String, 
    required: [true, 'Month is required'],
    match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    trim: true,
    validate: {
      validator: function(value) {
        // Additional validation: check if it's a valid month
        const [year, month] = value.split('-').map(Number);
        return year >= 2000 && year <= 2100 && month >= 1 && month <= 12;
      },
      message: 'Invalid month or year'
    }
  },
  description: { 
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true,
    default: ''
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative']
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    immutable: true // Prevent modification after creation
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true, // Automatically handle createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for remaining budget
BudgetSchema.virtual('remaining').get(function() {
  return this.limit - (this.spent || 0);
});

// Virtual for budget status
BudgetSchema.virtual('status').get(function() {
  const percentage = ((this.spent || 0) / this.limit) * 100;
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 90) return 'warning';
  if (percentage >= 75) return 'caution';
  return 'good';
});

// Pre-save middleware
BudgetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Normalize category to lowercase
  if (this.category) {
    this.category = this.category.toLowerCase().trim();
  }
  
  // Normalize month format
  if (this.month) {
    this.month = this.month.trim();
  }
  
  next();
});

// Compound index for efficient queries
BudgetSchema.index({ category: 1, month: -1 });
BudgetSchema.index({ month: -1, createdAt: -1 });
BudgetSchema.index({ user_id: 1, month: -1 }); // For future user-specific queries

// Static method to find budgets by month
BudgetSchema.statics.findByMonth = function(month) {
  return this.find({ month }).sort({ category: 1 });
};

// Static method to find budgets by category
BudgetSchema.statics.findByCategory = function(category) {
  return this.find({ category: category.toLowerCase() }).sort({ month: -1 });
};

// Instance method to check if budget is exceeded
BudgetSchema.methods.isExceeded = function() {
  return (this.spent || 0) >= this.limit;
};

// Instance method to get percentage used
BudgetSchema.methods.getPercentageUsed = function() {
  return Math.round(((this.spent || 0) / this.limit) * 100);
};

module.exports = mongoose.model('Budget', BudgetSchema);