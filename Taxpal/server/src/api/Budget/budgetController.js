const budgetService = require('../services/budgetService');

const getBudgets = (req, res) => {
  const budgets = budgetService.getAllBudgets();
  res.json(budgets);
};

const createBudget = (req, res) => {
  const newBudget = budgetService.createBudget(req.body);
  res.status(201).json(newBudget);
};

const updateBudget = (req, res) => {
  const updated = budgetService.updateBudget(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Budget not found' });
  res.json(updated);
};

const deleteBudget = (req, res) => {
  const deleted = budgetService.deleteBudget(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Budget not found' });
  res.json({ message: 'Deleted successfully' });
};

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
