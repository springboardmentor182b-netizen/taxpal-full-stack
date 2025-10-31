import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../auth/requireAuth";
import { createExpense, deleteExpense, listExpenses, updateExpense } from "./expense.controller";

/**
 * @swagger
 * tags:
 *   name: Expense
 *   description: Manage user expenses
 */

const router = Router();
router.use(requireAuth);

function validateExpenseBody(req: Request, res: Response, next: NextFunction) {
  const { description, amount, category, date } = req.body ?? {};
  if (typeof description !== "string" || !description.trim())
    return res.status(400).json({ message: "description is required" });
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0)
    return res.status(400).json({ message: "amount must be a positive number" });
  if (typeof category !== "string" || !category.trim())
    return res.status(400).json({ message: "category is required" });
  if (!date || Number.isNaN(Date.parse(date)))
    return res
      .status(400)
      .json({ message: "date must be a valid ISO date string (yyyy-mm-dd)" });
  return next();
}

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expense records
 *     tags: [Expense]
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get("/", listExpenses);

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expense]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description: { type: string }
 *               amount: { type: number }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Expense added successfully
 */
router.post("/", validateExpenseBody, createExpense);

router.put("/:id", validateExpenseBody, updateExpense);
router.delete("/:id", deleteExpense);

export default router;
