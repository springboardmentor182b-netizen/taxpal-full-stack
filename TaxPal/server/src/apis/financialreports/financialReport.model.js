const mongoose = require("mongoose");

/**
 * Financial Report Schema
 */
const financialReportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  reportType: {
    type: String,
    enum: ["income", "expense", "tax", "summary"],
    required: true,
  },
  dateRange: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  format: {
    type: String,
    enum: ["pdf", "csv", "excel"],
    default: "pdf",
  },
  filePath: String,
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

const FinancialReport = mongoose.model(
  "FinancialReport",
  financialReportSchema
);

module.exports = FinancialReport;
