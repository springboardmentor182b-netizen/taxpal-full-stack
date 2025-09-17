const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth"); // JWT auth middleware

// Add new transaction (income or expense)
router.post("/", auth, async (req, res) => {
  try {
    const { type, description, amount, category, date, notes } = req.body;
    const transaction = new Transaction({
      userId: req.user.id,
      type,
      description,
      amount,
      category,
      date,
      notes,
    });
    await transaction.save();
    res.json({ message: "Transaction added!", transaction });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
