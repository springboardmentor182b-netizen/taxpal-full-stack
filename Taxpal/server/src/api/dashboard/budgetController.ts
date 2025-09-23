import { Response } from 'express';
import { AuthedRequest } from '../auth/auth'; // unified path
import Budget from '../dashboard/Budget';
import Transaction from '../dashboard/Transaction';
import { body } from 'express-validator';

export const validateBudget = [
  body('category').isString().notEmpty(),
  body('limit').isNumeric().isFloat({ min: 0 }), // renamed to limit to match model
  body('month').isInt({ min: 1, max: 12 }),
  body('year').isInt({ min: 2000, max: 2100 })
];

export const getBudgets = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    const filter: any = { userId };
    if (month) filter.month = parseInt(month as string, 10);
    if (year)  filter.year  = parseInt(year  as string, 10);

    const budgets = await Budget.find(filter).lean();

    // Compute SPENT per-category for the SAME month/year (important)
    let spentMap = new Map<string, number>();
    if (filter.month && filter.year) {
      const start = new Date(filter.year, filter.month - 1, 1);
      const end   = new Date(filter.year, filter.month, 1);

      const spentByCat = await Transaction.aggregate([
        { $match: { userId, type: 'expense', date: { $gte: start, $lt: end } } },
        { $group: { _id: '$category', spent: { $sum: '$amount' } } }
      ]);
      spentMap = new Map(spentByCat.map((x: any) => [x._id as string, x.spent as number]));
    }

    const out = budgets.map(b => {
      const spent = spentMap.get(b.category) || 0;
      const remaining = Math.max(0, b.limit - spent);
      const usedPct = b.limit > 0 ? Math.min(100, (spent / b.limit) * 100) : 0;
      return { ...b, spent, remaining, usedPct };
    });

    res.json(out);
  } catch {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

export const createBudget = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const budget = new Budget({ ...req.body, userId });
    await budget.save();
    res.status(201).json(budget);
  } catch {
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

export const updateBudget = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const budget = await Budget.findOneAndUpdate({ _id: id, userId }, req.body, { new: true, runValidators: true });
    if (!budget) { res.status(404).json({ error: 'Budget not found' }); return; }
    res.json(budget);
  } catch {
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

export const deleteBudget = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const budget = await Budget.findOneAndDelete({ _id: id, userId });
    if (!budget) { res.status(404).json({ error: 'Budget not found' }); return; }
    res.json({ message: 'Budget deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};
