import { Router } from "express";
import {
  getDashboardController,
  addTransactionController,
  updateTransactionController,
  deleteTransactionController
} from "./dashboard.controller";

const router = Router();

router.get("/:id", getDashboardController);
router.post("/:dashboardId/transaction", addTransactionController);
router.put("/:dashboardId/transaction/:txId", updateTransactionController);
router.delete("/:dashboardId/transaction/:txId", deleteTransactionController);
export default router;
