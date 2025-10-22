
import { Router } from "express";
import {
  getDashboardController,
  addTransactionController,
  updateTransactionController,
  deleteTransactionController,
  upsertDashboardController
} from "./dashboard.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard management
 */

/**
 * @swagger
 * /api/v1/dashboard/{id}:
 *   get:
 *     summary: Get dashboard
 *     tags: [Dashboard]
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
 *         description: Dashboard data
 */
router.get("/:id", getDashboardController);

/**
 * @swagger
 * /api/v1/dashboard/{dashboardId}/transaction:
 *   post:
 *     summary: Add transaction
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction added
 */
router.post("/:dashboardId/transaction", addTransactionController);

/**
 * @swagger
 * /api/v1/dashboard/{dashboardId}/transaction/{txId}:
 *   put:
 *     summary: Update transaction
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: txId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 */
router.put("/:dashboardId/transaction/:txId", updateTransactionController);

/**
 * @swagger
 * /api/v1/dashboard/{dashboardId}/transaction/{txId}:
 *   delete:
 *     summary: Delete transaction
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: txId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted
 */
router.delete("/:dashboardId/transaction/:txId", deleteTransactionController);

/**
 * @swagger
 * /api/v1/dashboard/upsert/{userId}:
 *   post:
 *     summary: Upsert dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard upserted
 */
router.post("/upsert/:userId", upsertDashboardController);

export default router;