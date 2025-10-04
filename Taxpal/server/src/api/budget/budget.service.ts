import Budget, { IBudget } from './budget.model';
import { Types } from 'mongoose';

type CreateInput = {
  userId?: string;
  category: string;
  amount: number;
  month: string;               // 'YYYY-MM'
  monthStart?: Date;           // optional
  description?: string;
};

type FindParams = {
  userId?: string;
  month?: string;
  category?: string;
  limit?: number;
  skip?: number;
};

function monthStartFrom(month: string): Date {
  const m = String(month).trim();
  const mMatch = m.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
  if (!mMatch) throw new Error('month must be in YYYY-MM format');
  const y = Number(mMatch[1]);
  const mm = Number(mMatch[2]);
  // use UTC so it’s consistent regardless of server TZ
  return new Date(Date.UTC(y, mm - 1, 1));
}

export const budgetService = {
  async create(input: CreateInput): Promise<IBudget> {
    const month = String(input.month).trim();
    const doc: Partial<IBudget> = {
      userId: input.userId ? new Types.ObjectId(input.userId) : undefined,
      category: input.category.trim(),
      amount: Number(input.amount),
      month,
      monthStart: input.monthStart ?? monthStartFrom(month),
      description: input.description?.trim() ?? ''
    };
    return Budget.create(doc);
  },

  async findAll(params: FindParams) {
    const q: any = {};
    if (params.userId) q.userId = params.userId;
    if (params.month) q.month = String(params.month).trim();
    if (params.category) q.category = params.category;

    const cursor = Budget.find(q).sort({ monthStart: -1, category: 1 });
    if (params.skip) cursor.skip(params.skip);
    if (params.limit) cursor.limit(params.limit);
    return cursor.exec();
  },

  async getById(id: string, userId?: string) {
    const q: any = { _id: id };
    if (userId) q.userId = userId;
    return Budget.findOne(q).exec();
  },

  async update(id: string, patch: Partial<IBudget>, userId?: string) {
    const q: any = { _id: id };
    if (userId) q.userId = userId;

    const update: any = { ...patch };

    // if month changed, recompute monthStart
    if (patch.month && !patch.monthStart) {
      update.monthStart = monthStartFrom(patch.month);
    }
    if (typeof patch.description === 'string') {
      update.description = patch.description.trim();
    }
    if (typeof patch.category === 'string') {
      update.category = patch.category.trim();
    }
    if (typeof patch.amount !== 'undefined') {
      update.amount = Number(patch.amount);
    }

    return Budget.findOneAndUpdate(q, update, { new: true, runValidators: true }).exec();
  },

  async remove(id: string, userId?: string) {
    const q: any = { _id: id };
    if (userId) q.userId = userId;
    const res = await Budget.deleteOne(q).exec();
    return res.deletedCount > 0;
  }
};
