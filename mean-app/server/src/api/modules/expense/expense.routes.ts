import { Router } from 'express';
import { createExpense } from './expense.controller';
import { auth } from '../../middlewares/auth';

const router = Router();

// POST /api/expenses
router.post('/', auth, createExpense);

export default router;
