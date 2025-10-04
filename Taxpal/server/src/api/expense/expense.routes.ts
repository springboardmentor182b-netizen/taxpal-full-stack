import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { createExpense, deleteExpense, listExpenses, updateExpense } from './expense.controller';

const router = Router();

// Require a valid JWT for all expense routes
router.use(requireAuth);

// Minimal validator to catch obvious bad inputs early
function validateExpenseBody(req: Request, res: Response, next: NextFunction) {
  const { description, amount, category, date } = req.body ?? {};

  if (typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ message: 'description is required' });
  }
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    return res.status(400).json({ message: 'amount must be a positive number' });
  }
  if (typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({ message: 'category is required' });
  }
  if (!date || Number.isNaN(Date.parse(date))) {
    return res.status(400).json({ message: 'date must be a valid ISO date string (yyyy-mm-dd)' });
  }

  return next();
}

// CRUD
router.post('/', validateExpenseBody, createExpense);
router.get('/', listExpenses);

// NOTE: PUT here expects a full, valid expense body (same validator).
// If you want partial updates, switch to PATCH and a lighter validator.
router.put('/:id', validateExpenseBody, updateExpense);

router.delete('/:id', deleteExpense);

export default router;
