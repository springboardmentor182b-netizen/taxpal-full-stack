const exportService = require('./export.service');
const fs = require('fs');

// POST /api/exports
exports.createExport = async (req, res) => {
  try {
    const { reportId, userId, format } = req.body;
    if (!reportId || !userId || !format)
      return res.status(400).json({ success: false, error: 'Missing fields' });

    const exportRecord = await exportService.exportReport(reportId, userId, format);
    res.status(200).json({ success: true, export: exportRecord });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/exports/:id/download
exports.downloadExport = async (req, res) => {
  try {
    const filePath = await exportService.getExportFilePath(req.params.id);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ success: false, error: 'File not found' });
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
