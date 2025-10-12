import { Router } from "express";
import * as controller from "./taxReminder.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TaxReminders
 *   description: Manage quarterly tax reminders
 */

/**
 * @swagger
 * /api/v1/tax-reminders:
 *   get:
 *     summary: Get all reminders for the logged-in user
 *     tags: [TaxReminders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tax reminders
 */
router.get("/", auth, controller.getUserReminders);

/**
 * @swagger
 * /api/v1/tax-reminders/{id}:
 *   patch:
 *     summary: Update reminder status
 *     tags: [TaxReminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               status:
 *                 type: string
 *                 enum: [reminder, payment_done]
 *     responses:
 *       200:
 *         description: Updated reminder
 */
router.patch("/:id", auth, controller.updateReminder);

export default router;
