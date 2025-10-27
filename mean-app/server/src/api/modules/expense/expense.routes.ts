import { Router } from 'express';
import { createExpense } from './expense.controller';
import { auth } from '../../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Expense
 *   description: Expense management
 */

/**
 * @swagger
 * /api/expense:
 *   post:
 *     summary: Create expense
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Expense created
 */
router.post('/', auth, createExpense);

export default router;