import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';
import { body } from 'express-validator';

export const validateBudget = [
  body('category').isString().notEmpty(),
  body('amount').isNumeric().isFloat({ min: 0 }),
  body('month').isInt({ min: 1, max: 12 }),
  body('year').isInt({ min: 2000, max: 2100 })
];

export const getBudgets = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const filter: any = { userId };
    if (month) filter.month = parseInt(month as string);
    if (year) filter.year = parseInt(year as string);

    const budgets = await Budget.find(filter);

    // Calculate spent amounts
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await Transaction.aggregate([
          {
            $match: {
              userId: userId,
              category: budget.category,
              type: 'expense',
             /* date: {
                $gte: new Date(budget.year, budget.month - 1, 1),
                $lt: new Date(budget.year, budget.month, 1)
              } */
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        return {
          ...budget.toObject(),
          spent: spent[0]?.total || 0
        };
      })
    );

    res.json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

export const createBudget = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const budget = new Budget({
      ...req.body,
      userId
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

export const updateBudget = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

export const deleteBudget = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({ _id: id, userId });

    if (!budget) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};
