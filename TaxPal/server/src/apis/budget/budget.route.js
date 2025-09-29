const express = require("express");
const router = express.Router();
const budgetController = require("./budget.controller");
const { protect } = require("../auth/authMiddleware"); // adjust path if needed

// ✅ Protect all budget routes (requires login)
router.use(protect);

// Routes
router.post("/", budgetController.createBudget);
router.get("/", budgetController.getBudgets);
router.put("/:id", budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
