const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // maps to user_id
  category: { type: String, required: true },
  limit: { type: Number, required: true }, // spending limit
  month: { type: String, required: true } // e.g., "2025-09"
});

module.exports = mongoose.model("Budget", budgetSchema);