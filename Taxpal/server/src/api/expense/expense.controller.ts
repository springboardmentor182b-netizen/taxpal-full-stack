import { Response } from 'express';
import type { AuthedRequest } from '../../api/auth/requireAuth';  // <-- fixed path
import Expense from './Expense';                            // <-- model is in same folder

export async function createExpense(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Missing user context' });

    const { description, amount, category, date, notes } = req.body ?? {};
    const doc = await Expense.create({
      description,
      amount,
      category,
      date,
      notes,
      userId
    });

    return res.status(201).json(doc);
  } catch (err: any) {
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    console.error('[expense.create]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function listExpenses(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Missing user context' });

    const { from, to, category } = (req.query as any) || {};
    const q: any = { userId };

    if (category) q.category = category;
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = new Date(from);
      if (to)   q.date.$lte = new Date(to);
    }

    const items = await Expense.find(q).sort({ date: -1, createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error('[expense.list]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateExpense(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Missing user context' });

    const { id } = req.params;
    const updated = await Expense.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }  // <-- keep validators
    );

    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (err: any) {
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    console.error('[expense.update]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteExpense(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Missing user context' });

    const { id } = req.params;
    const deleted = await Expense.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ message: 'Not found' });

    return res.json({ deleted: true, _id: id });
  } catch (err) {
    console.error('[expense.delete]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
