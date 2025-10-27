const mongoose = require('mongoose');

const SimpleBudgetSchema = new mongoose.Schema({
  userEmail: { 
    type: String, 
    required: true, 
    index: true
  },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, default: 'General' },
  date: { type: Date, default: Date.now },
  description: { type: String, maxlength: 200 },
  createdAt: { type: Date, default: Date.now }
});

// Ensure the collection name is 'simplebudgets'
module.exports = mongoose.model('SimpleBudget', SimpleBudgetSchema, 'simplebudgets');
