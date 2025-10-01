const budgetService = require('./service');

/**
 * Budget Controller
 * Handles HTTP request/response logic for budget operations
 */
const budgetController = {
  // Create a new budget
  createBudget: async (req, res) => {
    try {
      const budgetData = req.body;
      console.log('[DEBUG] Creating budget:', budgetData);

      if (!budgetData.amount || isNaN(budgetData.amount) || budgetData.amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required' });
      }

      const budget = await budgetService.createBudget(budgetData);
      res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        data: budget
      });
    } catch (error) {
      console.error('[ERROR] Create budget failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create budget',
        error: error.message
      });
    }
  },

  // Get all budgets
  getAllBudgets: async (req, res) => {
    try {
      const budgets = await budgetService.getAllBudgets();
      res.status(200).json({
        success: true,
        data: budgets
      });
    } catch (error) {
      console.error('[ERROR] Get all budgets failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve budgets',
        error: error.message
      });
    }
  },

  // Get a specific budget by ID
  getBudgetById: async (req, res) => {
    try {
      const { id } = req.params;
      const budget = await budgetService.getBudgetById(id);
      
      if (!budget) {
        return res.status(404).json({
          success: false,
          message: 'Budget not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: budget
      });
    } catch (error) {
      console.error('[ERROR] Get budget by ID failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve budget',
        error: error.message
      });
    }
  },

  // Update a budget by ID
  updateBudget: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (updateData.amount && (isNaN(updateData.amount) || updateData.amount <= 0)) {
        return res.status(400).json({ error: 'Valid amount is required' });
      }
      
      const updatedBudget = await budgetService.updateBudget(id, updateData);
      
      if (!updatedBudget) {
        return res.status(404).json({
          success: false,
          message: 'Budget not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Budget updated successfully',
        data: updatedBudget
      });
    } catch (error) {
      console.error('[ERROR] Update budget failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update budget',
        error: error.message
      });
    }
  },

  // Delete a budget by ID
  deleteBudget: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await budgetService.deleteBudget(id);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Budget not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Budget deleted successfully'
      });
    } catch (error) {
      console.error('[ERROR] Delete budget failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete budget',
        error: error.message
      });
    }
  }
};

module.exports = budgetController;
