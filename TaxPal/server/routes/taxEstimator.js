const express = require('express');
const router = express.Router();
const TaxEstimate = require('../models/TaxEstimate');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * @route   POST /api/tax-estimator/calculate
 * @desc    Calculate estimated tax based on provided data
 * @access  Public
 */
router.post('/calculate', async (req, res) => {
  try {
    const {
      country,
      state,
      status,
      quarter,
      income,
      businessExpenses,
      retirement,
      healthInsurance,
      homeOffice,
      userEmail,
      userId
    } = req.body;

    // Basic validation
    if (!income || income <= 0) {
      return res.status(400).json({ error: 'Income must be greater than 0' });
    }

    // Simple calculation for now (this would be more complex in production)
    const totalDeductions = 
      (parseFloat(businessExpenses) || 0) + 
      (parseFloat(retirement) || 0) + 
      (parseFloat(healthInsurance) || 0) + 
      (parseFloat(homeOffice) || 0);
    
    const taxableIncome = Math.max(0, parseFloat(income) - totalDeductions);
    const estimatedTax = taxableIncome * 0.15;
    const effectiveTaxRate = parseFloat(income) > 0 ? (estimatedTax / parseFloat(income)) * 100 : 0;

    // Return the calculated values
    res.json({
      taxableIncome,
      estimatedTax,
      effectiveTaxRate,
      totalDeductions
    });
  } catch (error) {
    console.error('Error calculating tax:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/tax-estimator/save
 * @desc    Save tax estimate for a user
 * @access  Private
 */
router.post('/save', async (req, res) => {
  try {
    const {
      country,
      state,
      status,
      quarter,
      income,
      businessExpenses,
      retirement,
      healthInsurance,
      homeOffice,
      userEmail,
      userId
    } = req.body;

    if (!userEmail || !userId) {
      return res.status(400).json({ error: 'User information is required' });
    }

    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Find the user to get their name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new tax estimate record
    const taxEstimate = new TaxEstimate({
      userId,
      userEmail,
      userName: user.name || 'User',
      country,
      state,
      status,
      quarter,
      year: new Date().getFullYear(),
      income: parseFloat(income) || 0,
      businessExpenses: parseFloat(businessExpenses) || 0,
      retirement: parseFloat(retirement) || 0,
      healthInsurance: parseFloat(healthInsurance) || 0,
      homeOffice: parseFloat(homeOffice) || 0
    });

    // Save the tax estimate (calculations happen in pre-save hook)
    await taxEstimate.save();

    // Return the saved tax estimate
    res.status(201).json({ 
      message: 'Tax estimate saved successfully',
      taxEstimate
    });
  } catch (error) {
    console.error('Error saving tax estimate:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/tax-estimator/user/:userId
 * @desc    Get all tax estimates for a specific user
 * @access  Private
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    // Find all tax estimates for this user
    const taxEstimates = await TaxEstimate.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json(taxEstimates);
  } catch (error) {
    console.error('Error fetching tax estimates:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/tax-estimator/email/:email
 * @desc    Get all tax estimates for a user by email
 * @access  Private
 */
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find all tax estimates for this email
    const taxEstimates = await TaxEstimate.find({ userEmail: email.toLowerCase() })
      .sort({ createdAt: -1 });
    
    res.json(taxEstimates);
  } catch (error) {
    console.error('Error fetching tax estimates by email:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/tax-estimator/:id
 * @desc    Get a specific tax estimate by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid tax estimate ID format' });
    }
    
    const taxEstimate = await TaxEstimate.findById(id);
    
    if (!taxEstimate) {
      return res.status(404).json({ error: 'Tax estimate not found' });
    }
    
    res.json(taxEstimate);
  } catch (error) {
    console.error('Error fetching tax estimate:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/tax-estimator/:id
 * @desc    Delete a tax estimate
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid tax estimate ID format' });
    }
    
    const taxEstimate = await TaxEstimate.findById(id);
    
    if (!taxEstimate) {
      return res.status(404).json({ error: 'Tax estimate not found' });
    }
    
    await taxEstimate.remove();
    
    res.json({ message: 'Tax estimate deleted successfully' });
  } catch (error) {
    console.error('Error deleting tax estimate:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
