// src/api/dashboard/transaction.service.ts
import mongoose from 'mongoose';
import Transaction, { TransactionDoc } from './Transaction.model';

export type ListParams = {
  page?: number;
  limit?: number;
  type?: 'income' | 'expense';
  category?: string;
  startDate?: string;
  endDate?: string;
};

function toNumber(n: any, fallback: number): number {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

export async function listTransactions(
  userId: string,
  params: ListParams = {}
): Promise<{ transactions: any[]; total: number; page: number; limit: number }> {
  const page = Math.max(1, toNumber(params.page ?? 1, 1));
  const limit = Math.min(100, Math.max(1, toNumber(params.limit ?? 10, 10)));

  const filter: any = { userId };
  if (params.type) filter.type = params.type;
  if (params.category) filter.category = params.category;

  if (params.startDate || params.endDate) {
    filter.date = {};
    if (params.startDate) filter.date.$gte = new Date(params.startDate);
    if (params.endDate)   filter.date.$lte = new Date(params.endDate);
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

  return { transactions, total, page, limit };
}

export async function createTransaction(
  userId: string,
  body: any
): Promise<TransactionDoc> {
  const payload = {
    userId,
    type: String(body.type),
    amount: Number(body.amount),
    category: String(body.category),
    description: body.description != null ? String(body.description) : undefined,
    date: body.date instanceof Date ? body.date : new Date(String(body.date)),
  };
  return Transaction.create(payload);
}

export async function updateTransaction(
  userId: string,
  id: string,
  body: any
): Promise<any | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const patch: any = {};
  if (body.type != null)        patch.type = String(body.type);
  if (body.amount != null)      patch.amount = Number(body.amount);
  if (body.category != null)    patch.category = String(body.category);
  if (body.description != null) patch.description = String(body.description);
  if (body.date != null) {
    patch.date = body.date instanceof Date ? body.date : new Date(String(body.date));
  }

  return Transaction.findOneAndUpdate({ _id: id, userId }, patch, {
    new: true,
    runValidators: true,
  }).lean();
}

export async function deleteTransactionOne(
  userId: string,
  id: string
): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const deleted = await Transaction.findOneAndDelete({ _id: id, userId }).lean();
  return !!deleted;
}

export async function deleteAllForUser(userId: string): Promise<number> {
  const res = await Transaction.deleteMany({ userId });
  return res.deletedCount || 0;
}
