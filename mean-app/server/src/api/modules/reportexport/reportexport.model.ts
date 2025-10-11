import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  user_id: mongoose.Types.ObjectId;
  period: string; // e.g., "Jan 2025", "Q2 2024"
  report_type: string; // e.g., "summary", "detailed", "tax"
  file_path: string; // local path or URL
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    period: { type: String, required: true },
    report_type: { type: String, required: true },
    file_path: { type: String, required: true },
  },
  { timestamps: true }
);

export const ReportExport = mongoose.models.ReportExport || mongoose.model<IReport>('ReportExport', ReportSchema);

