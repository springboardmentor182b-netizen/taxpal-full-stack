const Budget = require("./budget.model");

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    const budget = new Budget({
      user_id: req.user._id, // assumes auth middleware attaches user
      category,
      limit,
      month,
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Failed to create budget", error });
  }
};

// Get all budgets for logged-in user
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user_id: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch budgets", error });
  }
};

// Update budget
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, limit, month } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: id, user_id: req.user._id },
      { category, limit, month },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: "Failed to update budget", error });
  }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({
      _id: id,
      user_id: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete budget", error });
  }
};