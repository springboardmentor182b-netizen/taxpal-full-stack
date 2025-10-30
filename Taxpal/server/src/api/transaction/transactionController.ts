import { Response } from 'express';
import { body } from 'express-validator';
import Transaction from './Transaction.model';
import { AuthedRequest } from '../auth/auth';
import mongoose, { Types } from 'mongoose';

export const validateTransaction = [
  body('type').isIn(['income', 'expense']).withMessage('type must be income|expense'),
  body('amount').isFloat({ min: 0 }).withMessage('amount must be >= 0'),
  body('category').isString().trim().notEmpty().withMessage('category is required'),
  body('description').optional().isString().trim(),
  body('date').isISO8601().withMessage('date must be ISO8601').toDate(),
];

function toNumber(n: any, fallback: number): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}
function toObjectId(id: string): Types.ObjectId | null {
  return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
}

export const getTransactions = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const userId = toObjectId(req.user.id);
    if (!userId) { res.status(400).json({ error: 'Invalid user id' }); return; }

    const rawPage  = (req.query.page  ?? 1) as any;
    const rawLimit = (req.query.limit ?? 10) as any;
    const page  = Math.max(1, toNumber(rawPage, 1));
    const limit = Math.min(100, Math.max(1, toNumber(rawLimit, 10)));

    const type      = req.query.type as 'income' | 'expense' | undefined;
    const category  = req.query.category as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate   = req.query.endDate as string | undefined;

    const filter: any = { userId };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (err) {
    console.error('[transactions.get]', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const getTransactionById = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const userId = toObjectId(req.user.id);
    if (!userId) { res.status(400).json({ error: 'Invalid user id' }); return; }

    const { id } = req.params;
    const _id = toObjectId(id);
    if (!_id) { res.status(400).json({ error: 'Invalid transaction id' }); return; }

    const tx = await Transaction.findOne({ _id, userId }).lean();
    if (!tx) { res.status(404).json({ error: 'Transaction not found' }); return; }
    res.json(tx);
  } catch (err) {
    console.error('[transactions.getById]', err);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

export const createTransaction = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const userId = toObjectId(req.user.id);
    if (!userId) { res.status(400).json({ error: 'Invalid user id' }); return; }

    const payload = {
      userId,
      type: String(req.body.type),
      amount: Number(req.body.amount),
      category: String(req.body.category),
      description: (req.body.description != null ? String(req.body.description) : undefined),
      date: req.body.date instanceof Date ? req.body.date : new Date(String(req.body.date)),
    };

    const tx = await Transaction.create(payload);
    res.status(201).json({ message: 'Transaction created', transaction: tx });
  } catch (err) {
    console.error('[transactions.create]', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const updateTransaction = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const userId = toObjectId(req.user.id);
    if (!userId) { res.status(400).json({ error: 'Invalid user id' }); return; }

    const { id } = req.params;
    const _id = toObjectId(id);
    if (!_id) { res.status(400).json({ error: 'Invalid transaction id' }); return; }

    const patch: any = {};
    if (req.body.type != null)        patch.type = String(req.body.type);
    if (req.body.amount != null)      patch.amount = Number(req.body.amount);
    if (req.body.category != null)    patch.category = String(req.body.category);
    if (req.body.description != null) patch.description = String(req.body.description);
    if (req.body.date != null) {
      patch.date = req.body.date instanceof Date ? req.body.date : new Date(String(req.body.date));
    }

    const tx = await Transaction.findOneAndUpdate(
      { _id, userId },
      patch,
      { new: true, runValidators: true }
    ).lean();

    if (!tx) { res.status(404).json({ error: 'Transaction not found' }); return; }
    res.json({ message: 'Transaction updated', transaction: tx });
  } catch (err) {
    console.error('[transactions.update]', err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const userId = toObjectId(req.user.id);
    if (!userId) { res.status(400).json({ error: 'Invalid user id' }); return; }

    const { id } = req.params;
    const _id = toObjectId(id);
    if (!_id) { res.status(400).json({ error: 'Invalid transaction id' }); return; }

    const deleted = await Transaction.findOneAndDelete({ _id, userId }).lean();
    if (!deleted) { res.status(404).json({ error: 'Transaction not found' }); return; }

    console.log(`[transactions.delete] user=${userId.toString()} _id=${_id.toString()} -> deleted`);
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error('[transactions.delete]', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

export const deleteAllTransactions = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const userId = toObjectId(req.user.id);
    if (!userId) { res.status(400).json({ error: 'Invalid user id' }); return; }

    const result = await Transaction.deleteMany({ userId });
    const deletedCount = result.deletedCount || 0;
    console.log(`[transactions.deleteAll] user=${userId.toString()} -> deletedCount=${deletedCount}`);
    res.json({ message: 'All transactions deleted', deletedCount });
  } catch (err) {
    console.error('[transactions.deleteAll]', err);
    res.status(500).json({ error: 'Failed to delete all transactions' });
  }
};
