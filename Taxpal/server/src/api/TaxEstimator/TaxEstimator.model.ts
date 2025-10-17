import mongoose, { Schema, Document } from "mongoose";
import { TaxInput } from "./TaxEstimator.types";

export interface TaxRecord extends TaxInput, Document {
  taxAmount: number;
  createdAt: Date;
}

const TaxEstimatorSchema = new Schema<TaxRecord>({
  income: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  taxYear: { type: Number, default: new Date().getFullYear() },
  taxAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const TaxEstimatorModel = mongoose.model<TaxRecord>(
  "TaxEstimator",
  TaxEstimatorSchema
);
