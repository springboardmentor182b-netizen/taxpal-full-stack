import { Response } from 'express';
import Income from '../models/Income';
import { AuthedRequest } from '../middleware/auth';

export async function createIncome(req: AuthedRequest, res: Response) {
  const doc = await Income.create({ ...req.body, userId: req.user!.id });
  res.status(201).json(doc);
}

export async function listIncomes(req: AuthedRequest, res: Response) {
  const { from, to, source } = req.query as any;
  const q: any = { userId: req.user!.id };
  if (source) q.source = source;
  if (from || to) q.date = {};
  if (from) q.date.$gte = new Date(from);
  if (to) q.date.$lte = new Date(to);
  const items = await Income.find(q).sort({ date: -1, createdAt: -1 });
  res.json(items);
}

export async function updateIncome(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const updated = await Income.findOneAndUpdate(
    { _id: id, userId: req.user!.id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
}

export async function deleteIncome(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const del = await Income.findOneAndDelete({ _id: id, userId: req.user!.id });
  if (!del) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
}
