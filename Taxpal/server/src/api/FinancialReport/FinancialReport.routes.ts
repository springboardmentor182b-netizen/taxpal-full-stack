import { Router } from "express";
import * as ctrl from "./FinancialReport.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Financial Reports
 *   description: API for managing financial reports
 */

/**
 * @swagger
 * /financial-reports:
 *   get:
 *     summary: List all financial reports
 *     tags: [Financial Reports]
 *     responses:
 *       200:
 *         description: Successfully fetched all reports
 */
router.get("/", ctrl.list);

/**
 * @swagger
 * /financial-reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Financial Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report details
 */
router.get("/:id", ctrl.byId);

/**
 * @swagger
 * /financial-reports/generate:
 *   post:
 *     summary: Generate a new financial report
 *     tags: [Financial Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportType:
 *                 type: string
 *                 example: "income-statement"
 *               period:
 *                 type: string
 *                 example: "this-month"
 *               format:
 *                 type: string
 *                 example: "pdf"
 *     responses:
 *       201:
 *         description: Report created successfully
 */
router.post("/generate", ctrl.generate);

/**
 * @swagger
 * /financial-reports/{id}:
 *   delete:
 *     summary: Delete a financial report
 *     tags: [Financial Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted successfully
 */
router.delete("/:id", ctrl.remove);

export default router;
