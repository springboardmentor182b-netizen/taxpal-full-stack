const express = require("express");
const router = express.Router();
const Transaction = require("./transactionController");
const auth = require("../auth/authMiddleware"); // JWT auth middleware
const User = require("../user/userModel"); // Assuming the user model is in this path

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for managing income and expense transactions
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Add a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *               - category
 *               - date
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       500:
 *         description: Server error
 */
router.post("/", auth, async (req, res) => {
  try {
    const { type, description, amount, category, date, notes } = req.body;
    const transaction = new Transaction({
      userId: req.user.id,
      type,
      description,
      amount,
      category,
      date,
      notes,
    });
    await transaction.save();
    res.json({ message: "Transaction added!", transaction });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions of the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Server error
 */

router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/users/delete-income/{id}:
 *   delete:
 *     summary: Delete an income entry
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Income deleted successfully
 *       404:
 *         description: Income not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-income/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.query;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const incomeIndex = user.incomes.findIndex(
      (income) => income._id.toString() === id
    );
    if (incomeIndex === -1) {
      return res.status(404).json({ error: "Income not found" });
    }

    user.incomes.splice(incomeIndex, 1);
    await user.save();

    res.json({ message: "Income deleted successfully" });
  } catch (err) {
    console.error("Error deleting income:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @swagger
 * /api/users/delete-expense/{id}:
 *   delete:
 *     summary: Delete an expense entry
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-expense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.query;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const expenseIndex = user.expenses.findIndex(
      (expense) => expense._id.toString() === id
    );
    if (expenseIndex === -1) {
      return res.status(404).json({ error: "Expense not found" });
    }

    user.expenses.splice(expenseIndex, 1);
    await user.save();

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
