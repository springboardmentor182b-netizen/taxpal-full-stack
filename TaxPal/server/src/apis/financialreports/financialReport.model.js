const mongoose = require('mongoose');

const FinancialReportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    reportType: { type: String, required: true },
    period: { type: String, required: true },
    format: { type: String, required: true },
    filePath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FinancialReport', FinancialReportSchema);
