import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import Transaction from '../models/Transaction';
import { body } from 'express-validator';

export const validateTransaction = [
  body('date').isISO8601().toDate(),
  body('description').isString().notEmpty(),
  body('category').isString().notEmpty(),
  body('amount').isNumeric().isFloat({ min: 0 }),
  body('type').isIn(['income', 'expense'])
];

export const getTransactions = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;

    const filter: any = { userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const createTransaction = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const transaction = new Transaction({
      ...req.body,
      userId
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const updateTransaction = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
