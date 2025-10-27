const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: String,
  date: {
    type: Date,
    default: Date.now
  },
  taxDeductible: {
    type: String,
    enum: ['yes', 'no', 'partial', '']
  },
  notes: String
});

module.exports = mongoose.model('Expense', ExpenseSchema);
