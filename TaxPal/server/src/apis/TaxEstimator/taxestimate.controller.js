/**
 * Tax Estimator Controller
 * Handles API request/response logic for tax estimate operations
 */

// Import service
const taxEstimateService = require('./taxestimate.service');
const TaxEstimate = require('./taxestimate.model');

/**
 * Calculate estimated taxes
 */
const calculateTax = async (req, res) => {
  try {
    const taxData = req.body;
    const result = await taxEstimateService.calculateTaxEstimate(taxData);

    // Simple tax calculation logic
    const { annualIncome, taxDeductibleExpenses, userEmail } = taxData;
    const taxableIncome = Math.max(0, annualIncome - taxDeductibleExpenses);
    let estimatedTax = 0;
    
    // Progressive tax brackets (example rates)
    if (taxableIncome <= 50000) {
      estimatedTax = taxableIncome * 0.15;
    } else if (taxableIncome <= 100000) {
      estimatedTax = 7500 + (taxableIncome - 50000) * 0.25;
    } else {
      estimatedTax = 20000 + (taxableIncome - 100000) * 0.35;
    }

    // Get previous tax estimate for comparison
    const previousEstimate = await TaxEstimate.findOne({ userEmail }).sort({ createdAt: -1 });
    const previousTax = previousEstimate ? previousEstimate.estimatedTax : 0;

    // Save new estimate
    await TaxEstimate.create({
      userEmail,
      annualIncome,
      taxDeductibleExpenses,
      taxableIncome,
      estimatedTax,
      createdAt: new Date()
    });

    return res.status(200).json({
      estimatedTax: Math.round(estimatedTax),
      previousTax: Math.round(previousTax),
      taxableIncome: Math.round(taxableIncome)
    });
  } catch (error) {
    console.error('Error in tax calculation:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error calculating tax estimate',
      error: error.message 
    });
  }
};

/**
 * Save tax estimate for user
 */
const saveTaxEstimate = async (req, res) => {
  try {
    const estimateData = req.body;
    const result = await taxEstimateService.saveTaxEstimate(estimateData);
    return res.status(201).json({
      success: true,
      message: 'Tax estimate saved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error saving tax estimate:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error saving tax estimate',
      error: error.message 
    });
  }
};

/**
 * Get tax estimates for a user
 */
const getUserTaxEstimates = async (req, res) => {
  try {
    const { userId } = req.params;
    const estimates = await taxEstimateService.getTaxEstimatesByUserId(userId);
    return res.status(200).json({
      success: true,
      data: estimates
    });
  } catch (error) {
    console.error('Error retrieving tax estimates:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving tax estimates',
      error: error.message 
    });
  }
};

module.exports = {
  calculateTax,
  saveTaxEstimate,
  getUserTaxEstimates
};
