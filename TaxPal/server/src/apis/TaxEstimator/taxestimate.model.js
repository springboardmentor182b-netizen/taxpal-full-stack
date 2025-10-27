const mongoose = require('mongoose');

const TaxEstimateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  country: { type: String },
  state: { type: String },
  status: { type: String },
  quarter: { type: String },
  income: { type: Number, default: 0 },
  businessExpenses: { type: Number, default: 0 },
  retirement: { type: Number, default: 0 },
  healthInsurance: { type: Number, default: 0 },
  homeOffice: { type: Number, default: 0 },
  taxableIncome: { type: Number, default: 0 },
  estimatedTax: { type: Number, default: 0 },
  effectiveRate: { type: Number, default: 0 },
  // Persist the user-selected due date (optional)
  dueDate: { type: Date, default: null },
  // allow marking/removal/tracking
  paid: { type: Boolean, default: false },
  paidAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('TaxEstimate', TaxEstimateSchema);