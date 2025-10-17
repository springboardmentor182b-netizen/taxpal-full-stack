const express = require("express");
const router = express.Router();

// Fix the path to the controller
const taxEstimateController = require("../src/apis/TaxEstimator/taxestimate.controller");

// POST: Calculate tax estimate
router.post("/calculate", taxEstimateController.calculateTax);

// GET: Get tax reminders
router.get("/reminders", taxEstimateController.getReminders);

module.exports = router;
