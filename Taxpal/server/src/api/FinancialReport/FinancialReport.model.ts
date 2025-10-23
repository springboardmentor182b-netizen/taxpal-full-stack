import mongoose, { Schema, Document } from 'mongoose';

export type ReportType = 'income-statement' | 'balance-sheet' | 'cash-flow';
export type ReportPeriod = 'current-month' | 'last-month' | 'this-quarter' | 'this-year';
export type ReportFormat = 'pdf' | 'csv' | 'xlsx';

export interface IFinancialReport extends Document {
  name?: string;
  reportType: ReportType;
  period: ReportPeriod;
  periodLabel: string;
  format: ReportFormat;
  dateFrom: Date;
  dateTo: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FinancialReportSchema = new Schema<IFinancialReport>({
  name: { type: String },
  reportType: { type: String, enum: ['income-statement', 'balance-sheet', 'cash-flow'], required: true },
  period: { type: String, enum: ['current-month', 'last-month', 'this-quarter', 'this-year'], required: true },
  periodLabel: { type: String, required: true },
  format: { type: String, enum: ['pdf', 'csv', 'xlsx'], required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model<IFinancialReport>('FinancialReport', FinancialReportSchema);
