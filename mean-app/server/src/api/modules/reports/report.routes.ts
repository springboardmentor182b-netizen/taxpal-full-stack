

import { Router } from "express";
import reportController from "./report.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/reports/generate:
 *   post:
 *     summary: Generate a new financial report
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportType
 *               - period
 *             properties:
 *               reportType:
 *                 type: string
 *                 enum: [Income Statement, Expense Report, Tax Summary, Budget Analysis, Cash Flow Statement]
 *               period:
 *                 type: string
 *                 enum: [Current Month, Last Month, Current Quarter, Last Quarter, Current Year, Last Year, Custom]
 *               format:
 *                 type: string
 *                 enum: [PDF, Excel, CSV]
 *                 default: PDF
 *               customPeriod:
 *                 type: object
 *                 properties:
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *     responses:
 *       201:
 *         description: Report generation started
 *       400:
 *         description: Validation error
 */
router.post("/generate", reportController.generateReport);

/**
 * @swagger
 * /api/v1/reports:
 *   get:
 *     summary: Get all reports for user
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of reports
 */
router.get("/", reportController.getReports);

/**
 * @swagger
 * /api/v1/reports/stats:
 *   get:
 *     summary: Get report statistics
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Report statistics
 */
router.get("/stats", reportController.getStats);

/**
 * @swagger
 * /api/v1/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report details
 *       404:
 *         description: Report not found
 */
router.get("/:id", reportController.getReportById);

/**
 * @swagger
 * /api/v1/reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted
 *       404:
 *         description: Report not found
 */
router.delete("/:id", reportController.deleteReport);

/**
 * @swagger
 * /api/v1/reports/download/{id}:
 *   get:
 *     summary: Download report file
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Download URL
 *       404:
 *         description: Report not found
 */
router.get("/download/:id", reportController.downloadReport);

export default router;