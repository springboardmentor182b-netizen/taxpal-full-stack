const mongoose = require('mongoose');
const Transaction = require('../../../../../../../routes/transactions');

class DashboardService {
    async getSummary(userId) {
        const objectId = mongoose.Types.ObjectId(userId);

        const income = await Transaction.aggregate([
            { $match: { user_id: objectId, type: 'income' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const expense = await Transaction.aggregate([
            { $match: { user_id: objectId, type: 'expense' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        return {
            income: income.length ? income[0].total : 0,
            expense: expense.length ? expense[0].total : 0,
            balance: (income.length ? income[0].total : 0) - (expense.length ? expense[0].total : 0)
        };
    }
}

module.exports = DashboardService;
