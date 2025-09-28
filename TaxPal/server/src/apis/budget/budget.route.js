const express = require("express");
const router = express.Router();
const budgetController = require("./budget.controller");
// Optional auth: if your app requires auth, import and use it here.
// const protect = require("../auth/authMiddleware");

// If you need protection, uncomment the next line.
// router.use(protect);

// Routes
router.post("/", budgetController.createBudget);
router.get("/", budgetController.getBudgets);
router.put("/:id", budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;