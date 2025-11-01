import { Router } from "express";
import * as ctrl from "./ExportDownload.controller";

/**
 * @swagger
 * tags:
 *   name: Export
 *   description: Export data as CSV, PDF, or XLSX
 */

const router = Router();

/**
 * @swagger
 * /export/preview:
 *   post:
 *     summary: Preview data before export
 *     tags: [Export]
 *     responses:
 *       200:
 *         description: Preview generated successfully
 */
router.post("/preview", ctrl.preview);

/**
 * @swagger
 * /export/download:
 *   post:
 *     summary: Download exported data
 *     tags: [Export]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               format:
 *                 type: string
 *                 enum: [csv, pdf, xlsx]
 *     responses:
 *       200:
 *         description: File download started
 */
router.post("/download", ctrl.download);

export default router;
