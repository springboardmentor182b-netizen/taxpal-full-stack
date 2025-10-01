const Budget = require('./model');

/**
 * Budget Service
 * Contains business logic for budget operations
 */
const budgetService = {
  // Create a new budget
  createBudget: async (budgetData) => {
    try {
      const budget = new Budget(budgetData);
      return await budget.save();
    } catch (error) {
      console.error('[SERVICE ERROR] Create budget failed:', error);
      throw error;
    }
  },

  // Get all budgets
  getAllBudgets: async () => {
    try {
      return await Budget.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('[SERVICE ERROR] Get all budgets failed:', error);
      throw error;
    }
  },

  // Get a specific budget by ID
  getBudgetById: async (id) => {
    try {
      return await Budget.findById(id);
    } catch (error) {
      console.error('[SERVICE ERROR] Get budget by ID failed:', error);
      throw error;
    }
  },

  // Update a budget
  updateBudget: async (id, updateData) => {
    try {
      return await Budget.findByIdAndUpdate(
        id, 
        { ...updateData, updatedAt: Date.now() }, 
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('[SERVICE ERROR] Update budget failed:', error);
      throw error;
    }
  },

  // Delete a budget
  deleteBudget: async (id) => {
    try {
      return await Budget.findByIdAndDelete(id);
    } catch (error) {
      console.error('[SERVICE ERROR] Delete budget failed:', error);
      throw error;
    }
  },

  // Get budgets by user ID
  getBudgetsByUserId: async (userId) => {
    try {
      return await Budget.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('[SERVICE ERROR] Get budgets by user ID failed:', error);
      throw error;
    }
  }
};

module.exports = budgetService;
