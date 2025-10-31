import express from "express";
import { TaxEstimatorController } from "./TaxEstimator.controller";

/**
 * @swagger
 * tags:
 *   name: Tax Estimator
 *   description: Estimate taxes and manage tax calendar events
 */

const router = express.Router();

/**
 * @swagger
 * /tax/calculate:
 *   post:
 *     summary: Calculate estimated tax based on income
 *     tags: [Tax Estimator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               annualIncome: { type: number }
 *     responses:
 *       200:
 *         description: Tax estimation result
 */
router.post("/calculate", TaxEstimatorController.estimateTax);

router.get("/records", TaxEstimatorController.getAllTaxRecords);
router.post("/calendar", TaxEstimatorController.addCalendarEvent);
router.get("/calendar", TaxEstimatorController.getAllCalendarEvents);
router.delete("/calendar/:id", TaxEstimatorController.deleteCalendarEvent);
router.delete("/calendar", TaxEstimatorController.deleteCalendarBulk);

export default router;
