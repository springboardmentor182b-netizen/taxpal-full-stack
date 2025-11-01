import { Router } from "express";
import { requireAuth } from "../auth/requireAuth";
import { createIncome, deleteIncome, listIncomes, updateIncome } from "./income.controller";

/**
 * @swagger
 * tags:
 *   name: Income
 *   description: Manage user income records
 */

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /incomes:
 *   get:
 *     summary: Retrieve all incomes
 *     tags: [Income]
 *     responses:
 *       200:
 *         description: List of income entries
 */
router.get("/", listIncomes);

/**
 * @swagger
 * /incomes:
 *   post:
 *     summary: Create a new income record
 *     tags: [Income]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               source:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Income record created successfully
 */
router.post("/", createIncome);

/**
 * @swagger
 * /incomes/{id}:
 *   put:
 *     summary: Update an existing income
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Income updated successfully
 */
router.put("/:id", updateIncome);

/**
 * @swagger
 * /incomes/{id}:
 *   delete:
 *     summary: Delete an income record
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Income deleted successfully
 */
router.delete("/:id", deleteIncome);

export default router;
