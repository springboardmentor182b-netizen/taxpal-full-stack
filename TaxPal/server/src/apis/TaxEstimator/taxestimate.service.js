const TaxEstimate = require("../../models/TaxEstimate");
const User = require("../../models/User");

/**
 * Calculate and save tax estimate based on input data
 */
const calculateTaxEstimate = async (taxData) => {
  try {
    console.log("Processing tax calculation:", taxData);

    // Extract values with defaults to avoid NaN issues
    const {
      income = 0,
      businessExpenses = 0,
      retirement = 0,
      healthInsurance = 0,
      homeOffice = 0,
      filingStatus = "single",
      state = "",
    } = taxData;

    // Convert values to numbers and handle nulls
    const numIncome = Number(income) || 0;
    const numBusinessExpenses = Number(businessExpenses) || 0;
    const numRetirement = Number(retirement) || 0;
    const numHealthInsurance = Number(healthInsurance) || 0;
    const numHomeOffice = Number(homeOffice) || 0;

    // Calculate total deductions
    const totalDeductions =
      numBusinessExpenses + numRetirement + numHealthInsurance + numHomeOffice;

    const taxableIncome = Math.max(0, numIncome - totalDeductions);

    // Calculate tax components
    const federalTax = calculateFederalTax(taxableIncome, filingStatus);
    const stateTax = calculateStateTax(taxableIncome, state);
    const selfEmploymentTax = calculateSelfEmploymentTax(taxableIncome);

    // Calculate total tax and effective tax rate
    const totalTax = federalTax + stateTax + selfEmploymentTax;
    const effectiveTaxRate = numIncome > 0 ? (totalTax / numIncome) * 100 : 0;

    const result = {
      taxableIncome,
      totalDeductions,
      totalTax,
      effectiveTaxRate,
      breakdown: {
        federalTax,
        stateTax,
        selfEmploymentTax,
      },
    };

    console.log("Tax calculation result:", result);
    return result;
  } catch (error) {
    console.error("Tax calculation error:", error);
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
      throw new Error("User not found");
    }

    // Create tax estimate document
    const taxEstimate = new TaxEstimate({
      userId,
      userEmail: user.email,
      ...data,
      createdAt: new Date(),
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
      throw new Error("User ID is required");
    }

    // Get estimates from database
    return await TaxEstimate.find({ userId }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    throw new Error(`Failed to retrieve tax estimates: ${error.message}`);
  }
};

/**
 * Helper function to calculate federal tax based on 2023 tax brackets
 */
const calculateFederalTax = (taxableIncome, filingStatus = "single") => {
  const brackets = {
    single: [
      { threshold: 0, rate: 0.1 },
      { threshold: 11000, rate: 0.12 },
      { threshold: 44725, rate: 0.22 },
      { threshold: 95375, rate: 0.24 },
      { threshold: 182100, rate: 0.32 },
      { threshold: 231250, rate: 0.35 },
      { threshold: 578125, rate: 0.37 },
    ],
  };

  let tax = 0;
  const applicableBrackets = brackets[filingStatus] || brackets.single;

  for (let i = 0; i < applicableBrackets.length; i++) {
    const currentBracket = applicableBrackets[i];
    const nextBracket = applicableBrackets[i + 1];

    if (taxableIncome > currentBracket.threshold) {
      const bracketIncome = nextBracket
        ? Math.min(taxableIncome, nextBracket.threshold) -
          currentBracket.threshold
        : taxableIncome - currentBracket.threshold;

      tax += bracketIncome * currentBracket.rate;
    }
  }

  return tax;
};

const calculateStateTax = (taxableIncome, state = "") => {
  // Implementation would vary by state
  // This is a simplified example using a flat rate
  const stateRates = {
    CA: 0.093,
    NY: 0.085,
    TX: 0,
    // Add more states as needed
  };

  const rate = stateRates[state] || 0.05; // Default rate
  return taxableIncome * rate;
};

const calculateSelfEmploymentTax = (taxableIncome) => {
  const socialSecurityRate = 0.124; // 12.4%
  const medicareRate = 0.029; // 2.9%
  const socialSecurityWageCap = 160200; // 2023 limit

  const socialSecurityTax =
    Math.min(taxableIncome, socialSecurityWageCap) * socialSecurityRate;
  const medicareTax = taxableIncome * medicareRate;

  return socialSecurityTax + medicareTax;
};

module.exports = {
  calculateTaxEstimate,
  saveTaxEstimate,
  getTaxEstimatesByUserId,
};
