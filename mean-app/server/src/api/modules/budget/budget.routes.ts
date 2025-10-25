
import { Router } from 'express';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

const router = Router();
const budgetService = new BudgetService(); 
const controller = new BudgetController(budgetService);

/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: Budget management
 */

/**
 * @swagger
 * /api/v1/budgets/{id}:
 *   get:
 *     summary: Get budgets by user ID
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of budgets
 */
router.get('/:id', (req, res) => controller.getBudgets(req, res));

/**
 * @swagger
 * /api/v1/budgets:
 *   post:
 *     summary: Create budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               period:
 *                 type: string
 *     responses:
 *       201:
 *         description: Budget created
 */
router.post('/', (req, res) => controller.createBudget(req, res));

/**
 * @swagger
 * /api/v1/budgets/{id}:
 *   delete:
 *     summary: Delete budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget deleted
 */
router.delete('/:id', (req, res) => controller.deleteBudget(req, res));

export default router;
