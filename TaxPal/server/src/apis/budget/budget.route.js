const express = require("express");
const router = express.Router();
const budgetController = require("./budget.controller");
const protect = require("../auth/authMiddleware"); // adjust path if needed

// ✅ Protect all budget routes (requires login)
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Budget management API
 */

/**
 * @swagger
 * /api/budget:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Budget'
 *     responses:
 *       201:
 *         description: Budget created successfully
 *       500:
 *         description: Failed to create budget
 *
 *   get:
 *     summary: Get all budgets for logged-in user
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of budgets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Budget'
 */

router.post("/", budgetController.createBudget);
router.get("/", budgetController.getBudgets);

/**
 * @swagger
 * /api/budget/{id}:
 *   put:
 *     summary: Update a budget by ID
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Budget ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Budget'
 *     responses:
 *       200:
 *         description: Budget updated
 *       404:
 *         description: Budget not found
 *
 *   delete:
 *     summary: Delete a budget by ID
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Budget ID
 *     responses:
 *       200:
 *         description: Budget deleted
 *       404:
 *         description: Budget not found
 */
router.put("/:id", budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;