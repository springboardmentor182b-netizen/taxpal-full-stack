import { Router } from "express";
import {
  getDashboardController,
  addTransactionController,
  updateTransactionController,
  deleteTransactionController,
  upsertDashboardController
} from "./dashboard.controller";

const router = Router();

router.get("/:id", getDashboardController);
router.post("/:dashboardId/transaction", addTransactionController);
router.put("/:dashboardId/transaction/:txId", updateTransactionController);
router.delete("/:dashboardId/transaction/:txId", deleteTransactionController);
// Upsert dashboard for a user
router.post("/upsert/:userId", upsertDashboardController);
export default router;