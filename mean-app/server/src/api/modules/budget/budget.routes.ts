import { Router } from 'express';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

const router = Router();

const budgetService = new BudgetService(); 
const controller = new BudgetController(budgetService); 

// GET: /api/v1/budgets/:id (where :id is the userId)
router.get('/:id', (req, res) => controller.getBudgets(req, res)); 

// POST: /api/v1/budgets
router.post('/', (req, res) => controller.createBudget(req, res));

// DELETE: /api/v1/budgets/:id (where :id is the budgetId)
router.delete('/:id', (req, res) => controller.deleteBudget(req, res));

export default router;