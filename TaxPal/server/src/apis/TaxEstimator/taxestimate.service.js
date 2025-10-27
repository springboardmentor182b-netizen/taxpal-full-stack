const TaxEstimate = require('../../../models/TaxEstimate');
const User = require('../../../models/User');

/**
 * Calculate and save tax estimate based on input data
 */
const calculateTaxEstimate = async (taxData) => {
  try {
    const {
      income,
      businessExpenses,
      retirement,
      healthInsurance,
      homeOffice,
      userId,
      filingStatus
    } = taxData;

    // Validate required data
    if (!income || !userId) {
      throw new Error('Income and user ID are required');
    }

    // Calculate deductions
    const totalDeductions = 
      parseFloat(businessExpenses || 0) +
      parseFloat(retirement || 0) +
      parseFloat(healthInsurance || 0) +
      parseFloat(homeOffice || 0);

    const taxableIncome = Math.max(0, parseFloat(income) - totalDeductions);
    
    // Calculate tax components
    const taxBreakdown = {
      federalTax: calculateFederalTax(taxableIncome, filingStatus),
      stateTax: calculateStateTax(taxableIncome, taxData.state),
      selfEmploymentTax: calculateSelfEmploymentTax(taxableIncome)
    };

    const totalTax = Object.values(taxBreakdown).reduce((a, b) => a + b, 0);
    const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;

    return {
      taxableIncome,
      totalDeductions,
      totalTax,
      effectiveTaxRate,
      breakdown: taxBreakdown
    };
  } catch (error) {
    throw new Error(`Tax calculation error: ${error.message}`);
  }
};

/**
 * Save detailed tax estimate
 */
const saveTaxEstimate = async (estimateData) => {
  try {
    const { userId, ...data } = estimateData;
    
    // Find user to get additional details
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create tax estimate document
    const taxEstimate = new TaxEstimate({
      userId,
      userEmail: user.email,
      ...data,
      createdAt: new Date()
    });

    // Save to database
    return await taxEstimate.save();
  } catch (error) {
    throw new Error(`Failed to save tax estimate: ${error.message}`);
  }
};

/**
 * Get tax estimates for a specific user
 */
const getTaxEstimatesByUserId = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get estimates from database
    return await TaxEstimate.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    throw new Error(`Failed to retrieve tax estimates: ${error.message}`);
  }
};

/**
 * Helper function to calculate federal tax based on 2023 tax brackets
 */
const calculateFederalTax = (taxableIncome, filingStatus = 'single') => {
  const brackets = {
    single: [
      { threshold: 0, rate: 0.10 },
      { threshold: 11000, rate: 0.12 },
      { threshold: 44725, rate: 0.22 },
      { threshold: 95375, rate: 0.24 },
      { threshold: 182100, rate: 0.32 },
      { threshold: 231250, rate: 0.35 },
      { threshold: 578125, rate: 0.37 }
    ]
  };

  let tax = 0;
  const applicableBrackets = brackets[filingStatus] || brackets.single;

  for (let i = 0; i < applicableBrackets.length; i++) {
    const currentBracket = applicableBrackets[i];
    const nextBracket = applicableBrackets[i + 1];
    
    if (taxableIncome > currentBracket.threshold) {
      const bracketIncome = nextBracket 
        ? Math.min(taxableIncome, nextBracket.threshold) - currentBracket.threshold
        : taxableIncome - currentBracket.threshold;
        
      tax += bracketIncome * currentBracket.rate;
    }
  }

  return tax;
};

const calculateStateTax = (taxableIncome, state = '') => {
  // Implementation would vary by state
  // This is a simplified example using a flat rate
  const stateRates = {
    'CA': 0.093,
    'NY': 0.085,
    'TX': 0,
    // Add more states as needed
  };

  const rate = stateRates[state] || 0.05; // Default rate
  return taxableIncome * rate;
};

const calculateSelfEmploymentTax = (taxableIncome) => {
  const socialSecurityRate = 0.124; // 12.4%
  const medicareRate = 0.029; // 2.9%
  const socialSecurityWageCap = 160200; // 2023 limit

  const socialSecurityTax = Math.min(taxableIncome, socialSecurityWageCap) * socialSecurityRate;
  const medicareTax = taxableIncome * medicareRate;

  return socialSecurityTax + medicareTax;
};

module.exports = {
  calculateTaxEstimate,
  saveTaxEstimate,
  getTaxEstimatesByUserId
};
