import express from 'express';
import Transaction from '../models/Transaction';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all transactions for user
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;
    
    const query: any = { user_id: req.user._id };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// Create new transaction
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { type, category, amount, date, description } = req.body;

    const transaction = new Transaction({
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
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error });
  }
});

// Get transaction by ID
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error });
  }
});

// Update transaction
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { type, category, amount, date, description } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { type, category, amount, date, description },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction', error });
  }
});

// Delete transaction
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
});

// Get transaction summary
router.get('/summary/stats', authenticateToken, async (req: any, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query: any = { user_id: req.user._id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const stats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Transaction.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction summary', error });
  }
});

export default router;
