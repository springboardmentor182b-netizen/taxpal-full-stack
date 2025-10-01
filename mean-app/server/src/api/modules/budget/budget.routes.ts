import { Router } from 'express';
import * as budgetController from './budget.controller.js'; // Assuming .js is correct for module type
// 2. Import the authentication middleware
import { authMiddleware } from '../../middlewares/auth.middleware.js'; 

const router = Router();

// All budget routes require authentication
// We use router.use(authMiddleware) to protect all routes below this line
router.use(authMiddleware);

// POST /api/budget - Create a new budget
router.post('/', budgetController.createBudget);

// GET /api/budget - Get all budgets for the authenticated user
router.get('/', budgetController.getBudgets);

// PUT /api/budget/:id - Update an existing budget
router.put('/:id', budgetController.updateBudget);

// DELETE /api/budget/:id - Delete a budget
router.delete('/:id', budgetController.deleteBudget);

export default router;
