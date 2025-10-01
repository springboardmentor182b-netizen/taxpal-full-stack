const BudgetService = require("./budget.service");
const budgetService = new BudgetService();

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const budget = await budgetService.createBudget({
      user_id: req.user?._id || req.body.user_id, // support both cases
      ...req.body,
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Failed to create budget", error });
  }
};

// Get all budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await budgetService.getBudgetsByUser(req.user._id);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch budgets", error });
  }
};

// Update budget
exports.updateBudget = async (req, res) => {
  try {
    const budget = await budgetService.updateBudget(
      req.params.id,
      req.user._id,
      req.body
    );
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: "Failed to update budget", error });
  }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await budgetService.deleteBudget(
      req.params.id,
      req.user._id
    );
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete budget", error });
  }
};