import { Response } from 'express';
import Income from './Income.model';
import Transaction from '../transaction/Transaction.model';
import { AuthedRequest } from '../auth/requireAuth';

function toDate(input: any): Date {
  if (!input) return new Date();
  const d = input instanceof Date ? input : new Date(String(input));
  return isNaN(d.getTime()) ? new Date() : d;
}

export async function createIncome(req: AuthedRequest, res: Response) {
  const body = req.body || {};
  const source = String(body.source ?? body.description ?? '').trim();
  if (!source) return res.status(400).json({ message: 'source/description is required' });

  const userId = req.user!.id;

  const doc = await Income.create({
    userId,
    source,
    category: body.category ? String(body.category).trim() : 'General',
    amount: Number(body.amount),
    date: toDate(body.date),
    notes: body.notes ? String(body.notes).trim() : undefined
  });

  // Mirror into Transaction for dashboards/recent
  await Transaction.create({
    userId,
    type: 'income',
    category: doc.category,
    amount: doc.amount,
    date: doc.date,
    description: doc.source
  });

  res.status(201).json(doc);
}

export async function listIncomes(req: AuthedRequest, res: Response) {
  const { from, to, source, category } = req.query as any;

  const q: any = { userId: req.user!.id };
  if (source)   q.source = String(source);
  if (category) q.category = String(category);

  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = toDate(from);
    if (to)   q.date.$lte = toDate(to);
  }

  const items = await Income.find(q).sort({ date: -1, createdAt: -1 }).lean();
  res.json(items);
}

export async function updateIncome(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const body = req.body || {};

  const patch: any = {};
  if (body.source != null || body.description != null) {
    patch.source = String(body.source ?? body.description ?? '').trim();
  }
  if (body.category != null) patch.category = String(body.category).trim();
  if (body.amount != null)   patch.amount = Number(body.amount);
  if (body.date != null)     patch.date   = toDate(body.date);
  if (body.notes != null)    patch.notes  = String(body.notes || '').trim() || undefined;

  const updated = await Income.findOneAndUpdate(
    { _id: id, userId: req.user!.id },
    patch,
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: 'Not found' });

  // (optional) keep Transaction in sync (heuristic)
  await Transaction.findOneAndUpdate(
    {
      userId: req.user!.id,
      type: 'income',
      description: updated.source,
      date: updated.date,
      amount: updated.amount
    },
    { category: updated.category },
    { upsert: false }
  );

  res.json(updated);
}

export async function deleteIncome(req: AuthedRequest, res: Response) {
  const { id } = req.params;

  // Use .lean() so we get a plain object with known fields
  const del = await Income.findOneAndDelete({ _id: id, userId: req.user!.id }).lean();
  if (!del) return res.status(404).json({ message: 'Not found' });

  // (optional) also remove a matching Transaction (best: store incomeId in Transaction)
  await Transaction.deleteOne({
    userId: req.user!.id,
    type: 'income',
    description: del.source,
    amount: del.amount,
    date: del.date
  });

  res.json({ ok: true });
}
