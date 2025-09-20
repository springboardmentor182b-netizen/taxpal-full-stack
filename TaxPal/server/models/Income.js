const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  date: { type: Date, required: true },
  notes: { type: String },
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Income', IncomeSchema);
