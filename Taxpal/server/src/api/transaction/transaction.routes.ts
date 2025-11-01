import { Router } from "express";
import { authenticateToken } from "../auth/auth";
import {
  createTransaction,
  deleteTransaction,
  deleteAllTransactions,
  getTransactions,
  getTransactionById,
  updateTransaction,
  validateTransaction,
} from "./transactionController";
import { handleValidationErrors } from "../../utils/validators/dashboardValidation";

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Manage income and expense transactions
 */

const router = Router();
router.use(authenticateToken);

router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.post("/", validateTransaction, handleValidationErrors, createTransaction);
router.put("/:id", validateTransaction, handleValidationErrors, updateTransaction);
router.delete("/", deleteAllTransactions);
router.delete("/:id", deleteTransaction);

export default router;
