const express = require('express');
const router = express.Router();
const financialReportController = require('./financialReport.controller');

router.post('/generate', financialReportController.generateReport);
router.get('/', financialReportController.listReports);
router.get('/:id/download', financialReportController.downloadReport);

module.exports = router;
