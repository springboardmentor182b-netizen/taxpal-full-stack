import express from "express";
import { FinancialReportController } from "./FinancialReport.controller";

const router = express.Router();
const controller = new FinancialReportController();

router.post("/", controller.createReport.bind(controller));
router.get("/", controller.getAllReports.bind(controller));
router.get("/export/csv", controller.exportCSV.bind(controller));
router.get("/export/excel", controller.exportExcel.bind(controller));
router.get("/export/pdf", controller.exportPDF.bind(controller)); 
router.delete("/:id", controller.deleteReport.bind(controller)); 
router.get("/download/:id", controller.downloadReport.bind(controller)); 


export default router;
