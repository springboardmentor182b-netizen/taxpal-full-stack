import { Router } from 'express';
import { BudgetController } from './budget.controller';
import { auth } from '../../middlewares/auth';

const router = Router();
const controller = new BudgetController();

router.get('/:id', (req, res) => controller.getBudgets(req, res));
// server/src/api/modules/budgets/budgets.routes.ts
router.post('/',(req, res) => controller.createBudget(req, res));

router.delete('/:id', (req, res) => controller.deleteBudget(req, res));

export default router;
