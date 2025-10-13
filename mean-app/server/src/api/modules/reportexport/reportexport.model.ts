// reportexport.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IReportExport extends Document {
  user_id: mongoose.Types.ObjectId;
  period: string;
  report_type: string;
  file_path: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportExportSchema = new Schema<IReportExport>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    period: { type: String, required: true },
    report_type: { type: String, required: true },
    file_path: { type: String, required: true },
  },
  { timestamps: true, collection: 'reportexports' }
);

export const ReportExport =
  mongoose.models.ReportExport || mongoose.model<IReportExport>('ReportExport', ReportExportSchema);
