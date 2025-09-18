const express = require('express');
const DashboardController = require('../dashboard/dashboard.controller');
const authMiddleware = require('../../../../../../../middleware/authMiddleware');


const router = express.Router();
const dashboardController = new DashboardController();

router.get('/summary', authMiddleware, (req, res) => dashboardController.getSummary(req, res));

module.exports = router;
