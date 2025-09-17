
const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        const income = await Transaction.aggregate([
            { $match: { user_id: mongoose.Types.ObjectId(userId), type: 'income' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const expense = await Transaction.aggregate([
            { $match: { user_id: mongoose.Types.ObjectId(userId), type: 'expense' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            income: income.length ? income[0].total : 0,
            expense: expense.length ? expense[0].total : 0,
            balance: (income.length ? income[0].total : 0) - (expense.length ? expense[0].total : 0)
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching dashboard summary' });
    }
});

module.exports = router;
