import { Router } from "express";
import reportController from "./report.controller";
import { auth } from "../../middlewares/auth"; 

//new

const router = Router();

/**
 * @swagger
 * /api/v1/reports/generate:
 *   post:
 *     summary: Generate a new financial report
 *     tags: [Reports]
 */
router.post("/generate", auth, reportController.generateReport); 
/**
 * @swagger
 * /api/v1/reports:
 *   get:
 *     summary: Get all reports for user
 *     tags: [Reports]
 */
router.get("/", auth, reportController.getReports);

/**
 * @swagger
 * /api/v1/reports/stats:
 *   get:
 *     summary: Get report statistics
 *     tags: [Reports]
 */
router.get("/stats", auth, reportController.getStats); 

/**
 * @swagger
 * /api/v1/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Reports]
 */
router.get("/:id", auth, reportController.getReportById); 

/**
 * @swagger
 * /api/v1/reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     tags: [Reports]
 */
router.delete("/:id", auth, reportController.deleteReport); 

/**
 * @swagger
 * /api/v1/reports/download/{id}:
 *   get:
 *     summary: Download report file
 *     tags: [Reports]
 */
router.get("/download/:id", auth, reportController.downloadReport); 

export default router;
