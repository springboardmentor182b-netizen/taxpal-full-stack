import express from "express";
import { TaxEstimatorController } from "./TaxEstimator.controller";

const router = express.Router();

router.post("/calculate", TaxEstimatorController.estimateTax);
router.get("/records", TaxEstimatorController.getAllRecords);

export default router;
