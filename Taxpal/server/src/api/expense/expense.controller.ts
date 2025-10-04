import { Response } from 'express';
import type { AuthedRequest } from '../auth/requireAuth';   // ← consistent with routes
import Expense from './Expense.model';

function toDate(input: any): Date {
  if (!input) return new Date();
  const d = input instanceof Date ? input : new Date(String(input));
  return isNaN(d.getTime()) ? new Date() : d;
}

export async function createExpense(req: AuthedRequest, res: Response) {
  try {
    const userId = req.user?.userId ?? req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Missing user context' });

    const { description, amount, category, date, notes } = req.body ?? {};
    const doc = await Expense.create({
      userId,
      description: String(description).trim(),
      amount: Number(amount),
      category: String(category).trim(),
      date: toDate(date),
      notes: typeof notes === 'string' ? notes.trim() : notes
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

    if (category) q.category = String(category);
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = toDate(from);
      if (to)   q.date.$lte = toDate(to);
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

    // Normalize a couple of fields just in case
    const body = { ...req.body };
    if (body.date) body.date = toDate(body.date);
    if (typeof body.description === 'string') body.description = body.description.trim();
    if (typeof body.category === 'string') body.category = body.category.trim();
    if (typeof body.amount !== 'undefined') body.amount = Number(body.amount);

    const updated = await Expense.findOneAndUpdate(
      { _id: id, userId },
      body,
      { new: true, runValidators: true }
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
