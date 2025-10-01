const mongoose = require('mongoose');

const SimpleBudgetSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Ensure the collection name is 'simplebudgets'
module.exports = mongoose.model('SimpleBudget', SimpleBudgetSchema, 'simplebudgets');
