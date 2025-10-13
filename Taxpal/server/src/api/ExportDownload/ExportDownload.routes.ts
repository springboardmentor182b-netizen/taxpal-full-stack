import express from "express";
import { ExportDownloadController } from "./ExportDownload.controller";

const router = express.Router();
const controller = new ExportDownloadController();

// Fetch all data
router.get("/", controller.getAllRecords.bind(controller));

// Export as CSV
router.get("/export/csv", controller.exportCSV.bind(controller));

// Export as Excel
router.get("/export/excel", controller.exportExcel.bind(controller));

export default router;
