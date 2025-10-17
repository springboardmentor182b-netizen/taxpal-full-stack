// models/TaxEstimate.js
const mongoose = require("mongoose");

const TaxEstimateSchema = new mongoose.Schema({
  income: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  tax: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TaxEstimate", TaxEstimateSchema);
