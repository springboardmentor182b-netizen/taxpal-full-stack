import { Request, Response } from 'express';
import { budgetService } from './budget.service';

function getUserId(req: Request): string | undefined {
  const user = (req as any).user;
  if (user?.id) return String(user.id);
  const header = req.header('x-user-id');
  return header ? String(header) : undefined;
}

export const budgetController = {
  async create(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const { category, amount, month, monthStart, description } = req.body || {};

      // basic guards so clients get 400s before Mongoose runs
      if (!category || typeof category !== 'string') {
        return res.status(400).json({ error: 'category is required' });
      }
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt < 0) {
        return res.status(400).json({ error: 'amount must be a non-negative number' });
      }
      if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(String(month))) {
        return res.status(400).json({ error: 'month must be in YYYY-MM format' });
      }

      const created = await budgetService.create({
        userId,
        category: category.trim(),
        amount: amt,
        month: String(month).trim(),
        monthStart: monthStart ? new Date(monthStart) : undefined,
        description: typeof description === 'string' ? description.trim() : undefined
      });

      return res.status(201).json(created);
    } catch (err: any) {
      if (err?.code === 11000) {
        return res.status(409).json({ error: 'Budget for this category & month already exists' });
      }
      if (err?.name === 'ValidationError') {
        // surface the first Mongoose validation message
        const first = Object.values(err.errors || {}).find(Boolean) as any;
        return res.status(400).json({ error: first?.message || 'Validation failed' });
      }
      if (err?.message === 'month must be in YYYY-MM format') {
        return res.status(400).json({ error: err.message });
      }
      console.error('[budgets:create] error', err);
      return res.status(500).json({ error: 'Failed to create budget' });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const { month, category, limit, skip } = req.query;

      const out = await budgetService.findAll({
        userId,
        month: typeof month === 'string' ? month : undefined,
        category: typeof category === 'string' ? category : undefined,
        limit: limit ? Number(limit) : undefined,
        skip:  skip ? Number(skip)  : undefined
      });

      return res.json(out);
    } catch (err) {
      console.error('[budgets:list] error', err);
      return res.status(500).json({ error: 'Failed to fetch budgets' });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const item = await budgetService.getById(req.params.id, userId);
      if (!item) return res.status(404).json({ error: 'Budget not found' });
      return res.json(item);
    } catch (err) {
      console.error('[budgets:getOne] error', err);
      return res.status(500).json({ error: 'Failed to fetch budget' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const updated = await budgetService.update(req.params.id, req.body || {}, userId);
      if (!updated) return res.status(404).json({ error: 'Budget not found' });
      return res.json(updated);
    } catch (err: any) {
      if (err?.code === 11000) {
        return res.status(409).json({ error: 'Budget for this category & month already exists' });
      }
      if (err?.name === 'ValidationError') {
        const first = Object.values(err.errors || {}).find(Boolean) as any;
        return res.status(400).json({ error: first?.message || 'Validation failed' });
      }
      console.error('[budgets:update] error', err);
      return res.status(500).json({ error: 'Failed to update budget' });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const ok = await budgetService.remove(req.params.id, userId);
      if (!ok) return res.status(404).json({ error: 'Budget not found' });
      return res.json({ ok: true });
    } catch (err) {
      console.error('[budgets:remove] error', err);
      return res.status(500).json({ error: 'Failed to delete budget' });
    }
  }
};
