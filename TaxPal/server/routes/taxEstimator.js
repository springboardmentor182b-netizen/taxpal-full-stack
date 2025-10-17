const express = require('express');
const router = express.Router();
const TaxEstimate = require('../models/TaxEstimate');

console.log('✓ Tax Estimator routes file loaded');

/**
 * POST /api/tax-estimator/calculate
 * Calculate tax estimate based on provided data
 */
router.post('/calculate', (req, res) => {
  try {
    console.log('=== TAX CALCULATION REQUEST ===');
    console.log('Request body:', req.body);
    
    const { 
      income, 
      businessExpenses = 0, 
      retirement = 0, 
      healthInsurance = 0, 
      homeOffice = 0, 
      status = 'Single' 
    } = req.body;

    // Validate required fields
    if (income === undefined || income === null) {
      return res.status(400).json({ message: 'Income is required' });
    }

    // Convert string values to numbers
    const numIncome = parseFloat(income);
    const numBusinessExpenses = parseFloat(businessExpenses || 0);
    const numRetirement = parseFloat(retirement || 0);
    const numHealthInsurance = parseFloat(healthInsurance || 0);
    const numHomeOffice = parseFloat(homeOffice || 0);

    // Calculate total deductions
    const totalDeductions = 
      numBusinessExpenses + 
      numRetirement + 
      numHealthInsurance + 
      numHomeOffice;
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, numIncome - totalDeductions);
    
    // Simple tax calculation based on filing status
    let taxRate = 0.15; // Default rate
    
    if (status === 'Single') {
      if (taxableIncome * 4 <= 11000) taxRate = 0.10;
      else if (taxableIncome * 4 <= 44725) taxRate = 0.12;
      else if (taxableIncome * 4 <= 95375) taxRate = 0.22;
      else taxRate = 0.24;
    } else if (status === 'Married') {
      if (taxableIncome * 4 <= 22000) taxRate = 0.10;
      else if (taxableIncome * 4 <= 89450) taxRate = 0.12;
      else if (taxableIncome * 4 <= 190750) taxRate = 0.22;
      else taxRate = 0.24;
    }
    
    // Calculate tax
    const estimatedTax = taxableIncome * taxRate;
    const effectiveTaxRate = numIncome > 0 ? (estimatedTax / numIncome) * 100 : 0;

    // Create tax breakdown
    const breakdown = {
      federalIncomeTax: estimatedTax * 0.7,
      selfEmploymentTax: estimatedTax * 0.3
    };

    console.log('✓ Tax calculation successful:', {
      taxableIncome,
      estimatedTax,
      effectiveTaxRate
    });

    res.json({
      taxableIncome,
      estimatedTax,
      effectiveTaxRate,
      breakdown
    });
  } catch (error) {
    console.error('✗ Error calculating tax:', error);
    res.status(500).json({ message: 'Server error while calculating tax' });
  }
});

/**
 * POST /api/tax-estimator/save
 * Save tax estimate to MongoDB
 */
router.post('/save', async (req, res) => {
  try {
    console.log('=== SAVE TAX ESTIMATE REQUEST ===');
    console.log('Request body:', req.body);
    
    const {
      userId,
      userEmail,
      country,
      state,
      status,
      quarter,
      income,
      businessExpenses,
      retirement,
      healthInsurance,
      homeOffice,
      taxableIncome,
      estimatedTax,
      effectiveRate
    } = req.body;

    // Validate required fields
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }
    
    if (!income || income <= 0) {
      return res.status(400).json({ message: 'Valid income is required' });
    }

    // Create new document
    const taxEstimate = new TaxEstimate({
      userId: userId || undefined,
      userEmail: userEmail.toLowerCase(),
      country: country || 'United States',
      state: state || '',
      status: status || 'Single',
      quarter: quarter || 'Q1',
      income: parseFloat(income),
      businessExpenses: parseFloat(businessExpenses || 0),
      retirement: parseFloat(retirement || 0),
      healthInsurance: parseFloat(healthInsurance || 0),
      homeOffice: parseFloat(homeOffice || 0),
      taxableIncome: parseFloat(taxableIncome || 0),
      estimatedTax: parseFloat(estimatedTax || 0),
      effectiveRate: parseFloat(effectiveRate || 0)
    });

    // Save to MongoDB
    const savedEstimate = await taxEstimate.save();
    
    console.log('✓ Tax estimate saved to MongoDB!');
    console.log('Document ID:', savedEstimate._id);
    console.log('Collection:', TaxEstimate.collection.name);
    
    res.status(201).json({ 
      success: true,
      message: 'Tax estimate saved successfully', 
      data: savedEstimate
    });
  } catch (error) {
    console.error('✗ Error saving tax estimate:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while saving tax estimate',
      error: error.message 
    });
  }
});

console.log('✓ Tax Estimator routes registered:');
console.log('  - POST /calculate');
console.log('  - POST /save');

module.exports = router;
