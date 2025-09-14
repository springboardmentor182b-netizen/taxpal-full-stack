"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all transactions for user
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;
        const query = { user_id: req.user._id };
        if (type)
            query.type = type;
        if (category)
            query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        const transactions = await Transaction_1.default.find(query)
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const total = await Transaction_1.default.countDocuments(query);
        res.json({
            transactions,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
});
// Create new transaction
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { type, category, amount, date, description } = req.body;
        const transaction = new Transaction_1.default({
            user_id: req.user._id,
            type,
            category,
            amount,
            date: date || new Date(),
            description
        });
        await transaction.save();
        res.status(201).json({
            message: 'Transaction created successfully',
            transaction
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error });
    }
});
// Get transaction by ID
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const transaction = await Transaction_1.default.findOne({
            _id: req.params.id,
            user_id: req.user._id
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching transaction', error });
    }
});
// Update transaction
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { type, category, amount, date, description } = req.body;
        const transaction = await Transaction_1.default.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, { type, category, amount, date, description }, { new: true });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({
            message: 'Transaction updated successfully',
            transaction
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating transaction', error });
    }
});
// Delete transaction
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const transaction = await Transaction_1.default.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user._id
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error });
    }
});
// Get transaction summary
router.get('/summary/stats', auth_1.authenticateToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { user_id: req.user._id };
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        const stats = await Transaction_1.default.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        const categoryStats = await Transaction_1.default.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);
        res.json({
            typeStats: stats,
            categoryStats
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching transaction summary', error });
    }
});
exports.default = router;
//# sourceMappingURL=transactions.js.map