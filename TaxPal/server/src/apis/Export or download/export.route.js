const express = require('express');
const router = express.Router();
const exportController = require('./export.controller');

// Create export (generate PDF/CSV)
router.post('/', exportController.createExport);

// Download exported file
router.get('/:id/download', exportController.downloadExport);

module.exports = router;
