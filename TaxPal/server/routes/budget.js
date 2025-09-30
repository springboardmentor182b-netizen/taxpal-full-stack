const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// POST /api/budget
router.post('/', async (req, res) => {
  try {
    const { category, limit, month, description } = req.body;
    if (!category || !limit || !month) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const budget = new Budget({
      category,
      limit,
      month,
      description
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /api/budget
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ month: -1, createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json([]);
  }
});

module.exports = router;
