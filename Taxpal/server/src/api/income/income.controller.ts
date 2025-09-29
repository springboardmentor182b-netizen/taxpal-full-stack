import { Response } from 'express';
import Income from './Income';
import { AuthedRequest } from '../auth/requireAuth';

export async function createIncome(req: AuthedRequest, res: Response) {
  const body = req.body || {};

  const doc = await Income.create({
    userId: req.user!.id,
    // accept either field name from the client
    source: body.source ?? body.description,
    description: body.description,     // lets the Mongoose alias set `source`
    category: body.category,
    amount: body.amount,
    date: body.date ?? new Date(),
    notes: body.notes
  });

  res.status(201).json(doc);
}

export async function listIncomes(req: AuthedRequest, res: Response) {
  const { from, to, source, category } = req.query as any;

  const q: any = { userId: req.user!.id };
  if (source)   q.source = source;
  if (category) q.category = category;

  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = new Date(String(from));
    if (to)   q.date.$lte = new Date(String(to));
  }

  const items = await Income.find(q).sort({ date: -1, createdAt: -1 }).lean();
  res.json(items);
}

export async function updateIncome(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const body = req.body || {};

  // allow updates via `description` too
  if (body.description && !body.source) body.source = body.description;

  const updated = await Income.findOneAndUpdate(
    { _id: id, userId: req.user!.id },
    body,
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
