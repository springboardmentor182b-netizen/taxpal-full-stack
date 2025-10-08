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
    lowercase: true,
    index: true
  },
  userName: {
    type: String,
    default: 'User'
  },
  country: {
    type: String,
    required: true,
    default: 'United States'
  },
  state: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'],
    default: 'Single'
  },
  quarter: {
    type: String,
    required: true,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    default: 'Q1'
  },
  year: {
    type: Number,
    required: true,
    default: () => new Date().getFullYear()
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
  // Additional fields for tax calculations
  additionalDeductions: {
    type: Number,
    default: 0,
    min: 0
  },
  taxableIncome: {
    type: Number,
    default: 0,
    min: 0
  },
  estimatedTax: {
    type: Number,
    default: 0,
    min: 0
  },
  effectiveTaxRate: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field for total deductions
TaxEstimateSchema.virtual('totalDeductions').get(function() {
  return (
    this.businessExpenses + 
    this.retirement + 
    this.healthInsurance + 
    this.homeOffice +
    this.additionalDeductions
  );
});

// Pre-save hook to calculate estimated tax
TaxEstimateSchema.pre('save', function(next) {
  // Update the updatedAt field
  this.updatedAt = new Date();
  
  // Calculate taxable income
  const totalDeductions = 
    this.businessExpenses + 
    this.retirement + 
    this.healthInsurance + 
    this.homeOffice +
    this.additionalDeductions;
    
  this.taxableIncome = Math.max(0, this.income - totalDeductions);
  
  // Basic tax calculation (this would be replaced by a more sophisticated calculation in production)
  // This is just a simple example using 15% flat rate
  this.estimatedTax = this.taxableIncome * 0.15;
  
  // Calculate effective tax rate
  this.effectiveTaxRate = this.income > 0 ? (this.estimatedTax / this.income) * 100 : 0;
  
  next();
});

module.exports = mongoose.model('TaxEstimate', TaxEstimateSchema);
