const taxEstimateService = require("./taxestimate.service");

exports.calculateTax = async (req, res) => {
  try {
    const taxData = req.body;
    const result = await taxEstimateService.calculateTaxEstimate(taxData);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error calculating tax estimate" });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await taxEstimateService.getTaxReminders();
    res.status(200).json(reminders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching tax reminders" });
  }
};
