const mongoose = require('mongoose');
const Transaction = require('../incomeExpenseapi/TransactionModel');

class DashboardService {
    async getSummary(userId) {
        const objectId = new mongoose.Types.ObjectId(userId);

        const income = await Transaction.aggregate([
            { $match: { userId: objectId, type: 'income' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const expense = await Transaction.aggregate([
            { $match: { userId: objectId, type: 'expense' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalIncome = income.length ? income[0].total : 0;
        const totalExpenses = expense.length ? expense[0].total : 0;

        return {
            totalIncome: totalIncome,
            totalExpenses: totalExpenses,
            netBalance: totalIncome - totalExpenses
        };
    }

    async getRecentTransactions(userId, limit = 5) {
        const objectId = new mongoose.Types.ObjectId(userId);

        const transactions = await Transaction.aggregate([
            { $match: { userId: objectId } },
            { $sort: { date: -1 } },
            { $limit: limit },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    amount: 1,
                    category: 1,
                    date: 1,
                    description: 1
                }
            }
        ]);

        return transactions;
    }

    async getExpenseBreakdown(userId) {
        const objectId = new mongoose.Types.ObjectId(userId);

        const expenses = await Transaction.aggregate([
            { $match: { userId: objectId, type: 'expense' } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        return expenses;
    }

    async getBudgetProgress(userId) {
        const objectId = new mongoose.Types.ObjectId(userId);

        // Get current month expenses by category
        const currentMonth = new Date();
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        const monthlyExpenses = await Transaction.aggregate([
            {
                $match: {
                    userId: objectId,
                    type: 'expense',
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: '$category',
                    spent: { $sum: '$amount' }
                }
            }
        ]);

        // Define budget limits (could be made configurable later)
        const budgets = {
            'Office': 2000,
            'Software & Tools': 800,
            'Marketing': 1500,
            'Travel': 1000,
            'Meals': 600,
            'Other': 500
        };

        const budgetProgress = monthlyExpenses.map(expense => ({
            category: expense._id,
            spent: expense.spent,
            budget: budgets[expense._id] || 500,
            percentage: ((expense.spent / (budgets[expense._id] || 500)) * 100)
        }));

        return budgetProgress;
    }

    async getTaxEstimation(userId, taxYear = new Date().getFullYear()) {
        const objectId = new mongoose.Types.ObjectId(userId);

        const startOfYear = new Date(taxYear, 0, 1);
        const endOfYear = new Date(taxYear, 11, 31);

        const yearlyIncome = await Transaction.aggregate([
            {
                $match: {
                    userId: objectId,
                    type: 'income',
                    date: { $gte: startOfYear, $lte: endOfYear }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalIncome = yearlyIncome.length ? yearlyIncome[0].total : 0;
        const estimatedTax = totalIncome * 0.15; // 15% tax rate
        const quarterlyPayments = estimatedTax / 4;

        return {
            year: taxYear,
            totalIncome: totalIncome,
            estimatedTax: estimatedTax,
            quarterlyPayment: quarterlyPayments,
            taxRate: 15
        };
    }
}

module.exports = DashboardService;
