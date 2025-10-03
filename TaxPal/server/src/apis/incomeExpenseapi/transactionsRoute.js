const express = require("express");
const router = express.Router();
const Transaction = require("./transactionController");
const auth = require("../auth/authMiddleware"); // JWT auth middleware

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

module.exports = router;
