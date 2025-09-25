const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const auth = require("../middleware/authMiddleware");

// Create a new budget
router.post("/", auth, async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    const budget = new Budget({
      userId: req.user.id,
      category,
      limit,
      month,
    });
    await budget.save();
    res.json({ message: "Budget added!", budget });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all budgets for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// update a budget
router.put("/:id", auth, async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { category, limit, month },
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget updated!", budget });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  delete a budget
router.delete("/:id", auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;