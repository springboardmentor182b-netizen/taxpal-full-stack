/**
 * Tax Estimator Controller
 * Handles API request/response logic for tax estimate operations
 */

// Import service
const taxEstimateService = require("./taxestimate.service");

/**
 * Calculate estimated taxes
 */
const calculateTax = async (req, res) => {
  try {
    console.log("Tax calculation request received:", req.body);
    const taxData = req.body;

    // Validate input
    if (!taxData || !taxData.income) {
      return res.status(400).json({
        success: false,
        message: "Income is required for tax calculation",
      });
    }

    const result = await taxEstimateService.calculateTaxEstimate(taxData);
    console.log("Tax calculation result:", result);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in tax calculation:", error);
    return res.status(500).json({
      success: false,
      message: "Error calculating tax estimate",
      error: error.message,
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
      message: "Tax estimate saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error saving tax estimate:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving tax estimate",
      error: error.message,
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
      data: estimates,
    });
  } catch (error) {
    console.error("Error retrieving tax estimates:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving tax estimates",
      error: error.message,
    });
  }
};

module.exports = {
  calculateTax,
  saveTaxEstimate,
  getUserTaxEstimates,
};
