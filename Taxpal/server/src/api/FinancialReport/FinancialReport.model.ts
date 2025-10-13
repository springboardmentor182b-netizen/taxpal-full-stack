import mongoose, { Schema, Document } from "mongoose";
import { FinancialReport } from "./FinancialReport.types";

export interface FinancialReportDocument extends FinancialReport, Document {}

const FinancialReportSchema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const FinancialReportModel = mongoose.model<FinancialReportDocument>(
  "FinancialReport",
  FinancialReportSchema
);
