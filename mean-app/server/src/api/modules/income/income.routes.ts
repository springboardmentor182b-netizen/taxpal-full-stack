
import { Router } from 'express';
import { createIncome } from './income.controller';
import { auth } from '../../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Income
 *   description: Income management
 */

/**
 * @swagger
 * /api/income:
 *   post:
 *     summary: Create income
 *     tags: [Income]
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
 *               source:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Income created
 */
router.post('/', auth, createIncome);

export default router;
