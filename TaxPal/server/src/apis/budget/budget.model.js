const mongoose = require("mongoose");

// Define budget schema
const budgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  description: String,
});

// Create budget model
const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
