// budget.routes.ts
import { Router } from 'express';
import { authenticateToken } from '../auth/auth';
import { createBudget, deleteBudget, getBudgets, updateBudget, validateBudget } from '../dashboard/budgetController';
import { handleValidationErrors } from '../../utils/validators/dashboardValidation';

const r = Router();
r.use(authenticateToken);
r.get('/', getBudgets);
r.post('/', validateBudget, handleValidationErrors, createBudget);
r.put('/:id', validateBudget, handleValidationErrors, updateBudget);
r.delete('/:id', deleteBudget);
export default r;
