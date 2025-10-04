import { Router } from 'express';
import { budgetController } from './budget.controller';

const router = Router();

// POST /api/v1/budgets
router.post('/', budgetController.create);

// GET /api/v1/budgets?month=YYYY-MM&category=Groceries&limit=50&skip=0
router.get('/', budgetController.list);

// GET /api/v1/budgets/:id
router.get('/:id', budgetController.getOne);

// PATCH /api/v1/budgets/:id
router.patch('/:id', budgetController.update);

// DELETE /api/v1/budgets/:id
router.delete('/:id', budgetController.remove);

export default router;
