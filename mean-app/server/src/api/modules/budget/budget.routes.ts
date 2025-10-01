import { Router } from 'express';
// 1. Import the controller functions (FIXED: Added .js extension)
import * as budgetController from './budget.controller.js';
// 2. Import the authentication middleware (FIXED: Added .js extension)
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// Apply authMiddleware to ALL budget routes to ensure user is authenticated
// The middleware will attach req.userId, which is needed by the controller/service

// POST /api/budget - Create a new budget
router.post('/', authMiddleware, budgetController.createBudget);

// GET /api/budget - Get all budgets for the authenticated user
router.get('/', authMiddleware, budgetController.getBudgets);

// PUT /api/budget/:id - Update an existing budget
router.put('/:id', authMiddleware, budgetController.updateBudget);

// DELETE /api/budget/:id - Delete a budget
router.delete('/:id', authMiddleware, budgetController.deleteBudget);

export default router;