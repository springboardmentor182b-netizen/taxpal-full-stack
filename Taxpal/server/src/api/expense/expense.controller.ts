import { Response } from 'express';
import Expense from '../expense/Expense';
import { AuthedRequest } from '../../api/auth/auth';

export async function createExpense(req: AuthedRequest, res: Response) {
  const body = req.body;
  const doc = await Expense.create({ ...body, userId: req.user!.id });
  res.status(201).json(doc);
}

export async function listExpenses(req: AuthedRequest, res: Response) {
  const { from, to, category } = req.query as any;
  const q: any = { userId: req.user!.id };
  if (category) q.category = category;
  if (from || to) q.date = {};
  if (from) q.date.$gte = new Date(from);
  if (to) q.date.$lte = new Date(to);
  const items = await Expense.find(q).sort({ date: -1, createdAt: -1 });
  res.json(items);
}

export async function updateExpense(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const updated = await Expense.findOneAndUpdate(
    { _id: id, userId: req.user!.id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
}

export async function deleteExpense(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const del = await Expense.findOneAndDelete({ _id: id, userId: req.user!.id });
  if (!del) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
}
