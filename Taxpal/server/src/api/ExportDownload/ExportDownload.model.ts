import mongoose, { Schema, Document } from "mongoose";
import { ExportRecord } from "./ExportDownload.types";

export interface ExportRecordDocument extends ExportRecord, Document {}

const ExportRecordSchema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const ExportRecordModel = mongoose.model<ExportRecordDocument>(
  "ExportRecord",
  ExportRecordSchema
);
