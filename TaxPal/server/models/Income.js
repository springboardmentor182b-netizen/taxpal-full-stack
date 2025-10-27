const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  userEmail: { 
    type: String, 
    required: true,
    index: true
  },
  title: String,
  amount: Number,
  category: String,
  date: Date,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Income', IncomeSchema);
