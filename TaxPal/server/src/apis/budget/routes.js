const express = require('express');
const router = express.Router();
const budgetController = require('./controller');

/**
 * Budget Routes
 * Define API endpoints for budget operations
 */

// Create a new budget
router.post('/', budgetController.createBudget);

// Get all budgets
router.get('/', budgetController.getAllBudgets);

// Get a specific budget by ID
router.get('/:id', budgetController.getBudgetById);

// Update a budget
router.put('/:id', budgetController.updateBudget);

// Delete a budget
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
