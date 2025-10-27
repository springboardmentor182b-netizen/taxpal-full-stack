const mongoose = require('mongoose');

const TaxEstimateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  country: {
    type: String,
    default: 'United States'
  },
  state: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Single', 'Married', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'],
    default: 'Single'
  },
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    default: 'Q1'
  },
  income: {
    type: Number,
    required: true,
    min: 0
  },
  businessExpenses: {
    type: Number,
    default: 0,
    min: 0
  },
  retirement: {
    type: Number,
    default: 0,
    min: 0
  },
  healthInsurance: {
    type: Number,
    default: 0,
    min: 0
  },
  homeOffice: {
    type: Number,
    default: 0,
    min: 0
  },
  taxableIncome: {
    type: Number,
    default: 0
  },
  estimatedTax: {
    type: Number,
    default: 0
  },
  effectiveRate: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
TaxEstimateSchema.index({ userEmail: 1, createdAt: -1 });

module.exports = mongoose.model('TaxEstimate', TaxEstimateSchema);