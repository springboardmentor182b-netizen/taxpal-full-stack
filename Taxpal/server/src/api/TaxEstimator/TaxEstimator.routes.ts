import express from "express";
import { TaxEstimatorController } from "./TaxEstimator.controller";

const router = express.Router();

// ----- Tax Estimation -----
router.post("/calculate", TaxEstimatorController.estimateTax);
router.get("/records", TaxEstimatorController.getAllTaxRecords);

// ----- Tax Calendar -----
router.post("/calendar", TaxEstimatorController.addCalendarEvent);
router.get("/calendar", TaxEstimatorController.getAllCalendarEvents);
router.delete("/calendar/:id", TaxEstimatorController.deleteCalendarEvent);

export default router;
