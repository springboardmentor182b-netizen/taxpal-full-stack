const Budget = require("./budget.model");

class BudgetService {
    // Create a new budget
    async createBudget({ user_id, category, limit, month }) {
        const budget = new Budget({ user_id, category, limit, month });
        return await budget.save();
    }

    // Get all budgets for a user
    async getBudgetsByUser(user_id) {
        return await Budget.find({ user_id });
    }

    // Update budget by id and user
    async updateBudget(id, user_id, { category, limit, month }) {
        return await Budget.findOneAndUpdate(
            { _id: id, user_id },
            { category, limit, month },
            { new: true }
        );
    }

    // Delete budget by id and user
    async deleteBudget(id, user_id) {
        return await Budget.findOneAndDelete({ _id: id, user_id });
    }
}

module.exports = BudgetService;