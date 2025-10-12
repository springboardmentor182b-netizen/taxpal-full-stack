const mongoose = require('mongoose');

const ExportReportSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'FinancialReport', required: true },
  userId: { type: String, required: true },
  exportFormat: { type: String, enum: ['pdf', 'csv'], required: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExportReport', ExportReportSchema);
