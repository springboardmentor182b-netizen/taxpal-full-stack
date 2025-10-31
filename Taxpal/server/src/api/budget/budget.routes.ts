import { Router } from "express";
import { budgetController } from "./budget.controller";

/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: Manage user budgets
 */

const router = Router();

/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: List all budgets
 *     tags: [Budget]
 *     responses:
 *       200:
 *         description: Array of budgets
 */
router.get("/", budgetController.list);

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budget]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category: { type: string }
 *               amount: { type: number }
 *               month: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Budget created successfully
 */
router.post("/", budgetController.create);

router.get("/:id", budgetController.getOne);
router.patch("/:id", budgetController.update);
router.delete("/:id", budgetController.remove);

export default router;
