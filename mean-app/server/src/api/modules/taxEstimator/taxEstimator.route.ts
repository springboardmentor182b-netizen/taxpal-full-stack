import { Router } from "express";
import * as controller from "./taxEstimator.controller";
import { auth } from "../../middlewares/auth";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: TaxEstimator
 *   description: Tax estimation management
 */
/**
 * @swagger
 * /api/v1/tax-estimates:
 *   post:
 *     summary: Create a new tax estimate
 *     tags: [TaxEstimator]
 *     security:
 *       - bearerAuth: []   # <-- add this line
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               quarter:
 *                 type: string
 *               filing_status:
 *                 type: string
 *               gross_income_for_quarter:
 *                 type: number
 *               business_expenses:
 *                 type: number
 *               retirement_contribution:
 *                 type: number
 *               health_insurance_premiums:
 *                 type: number
 *               home_office_deduction:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tax estimate created
 */
router.post("/",auth, controller.createTaxEstimate);

/**
 * @swagger
 * /api/v1/tax-estimates:
 *   get:
 *     summary: Get all tax estimates
 *     tags: [TaxEstimator]
 *     security:
 *       - bearerAuth: []   # <-- add this line
 *     responses:
 *       200:
 *         description: List of tax estimates
 */
router.get("/",auth, controller.getTaxEstimates);
/**
 * @swagger
 * /api/v1/tax-estimates/{id}:
 *   get:
 *     summary: Get tax estimate by ID
 *     tags: [TaxEstimator]
 *     security:
 *       - bearerAuth: []   # <-- add this line
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tax estimate object
 *       404:
 *         description: Not found
 */
router.get("/:id",auth, controller.getTaxEstimateById);
export default router;
