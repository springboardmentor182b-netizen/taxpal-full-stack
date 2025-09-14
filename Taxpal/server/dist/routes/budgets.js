"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Budget_1 = __importDefault(require("../models/Budget"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all budgets for user
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { month } = req.query;
        const query = { user_id: req.user._id };
        if (month)
            query.month = month;
        const budgets = await Budget_1.default.find(query).sort({ category: 1 });
        // Calculate spent amounts
        for (const budget of budgets) {
            const startDate = new Date(budget.month + '-01');
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            const spent = await Transaction_1.default.aggregate([
                {
                    $match: {
                        user_id: req.user._id,
                        type: 'expense',
                        category: budget.category,
                        date: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]);
            budget.spent = spent.length > 0 ? spent[0].total : 0;
            await budget.save();
        }
        res.json(budgets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching budgets', error });
    }
});
// Create new budget
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { category, limit, month } = req.body;
        // Check if budget already exists for this category and month
        const existingBudget = await Budget_1.default.findOne({
            user_id: req.user._id,
            category,
            month
        });
        if (existingBudget) {
            return res.status(400).json({ message: 'Budget already exists for this category and month' });
        }
        const budget = new Budget_1.default({
            user_id: req.user._id,
            category,
            limit,
            month
        });
        await budget.save();
        res.status(201).json({
            message: 'Budget created successfully',
            budget
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating budget', error });
    }
});
// Update budget
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { limit } = req.body;
        const budget = await Budget_1.default.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, { limit }, { new: true });
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json({
            message: 'Budget updated successfully',
            budget
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating budget', error });
    }
});
// Delete budget
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const budget = await Budget_1.default.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user._id
        });
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json({ message: 'Budget deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting budget', error });
    }
});
// Get budget summary
router.get('/summary/overview', auth_1.authenticateToken, async (req, res) => {
    try {
        const { month } = req.query;
        const currentMonth = month || new Date().toISOString().slice(0, 7);
        const budgets = await Budget_1.default.find({
            user_id: req.user._id,
            month: currentMonth
        });
        const budgetSummary = await Promise.all(budgets.map(async (budget) => {
            const startDate = new Date(budget.month + '-01');
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            const spent = await Transaction_1.default.aggregate([
                {
                    $match: {
                        user_id: req.user._id,
                        type: 'expense',
                        category: budget.category,
                        date: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]);
            const spentAmount = spent.length > 0 ? spent[0].total : 0;
            const remaining = budget.limit - spentAmount;
            const percentage = (spentAmount / budget.limit) * 100;
            return {
                category: budget.category,
                limit: budget.limit,
                spent: spentAmount,
                remaining,
                percentage: Math.round(percentage * 100) / 100,
                status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
            };
        }));
        res.json(budgetSummary);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching budget summary', error });
    }
});
exports.default = router;
//# sourceMappingURL=budgets.js.map