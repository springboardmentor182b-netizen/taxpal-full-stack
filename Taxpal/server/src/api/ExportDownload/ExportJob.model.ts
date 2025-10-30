import { Schema, model, Document, Types } from 'mongoose';

export interface IExportJob extends Document {
  report?: Types.ObjectId;
  filename: string;
  format: 'pdf'|'csv'|'xlsx';
  status: 'ready'|'failed';
  createdAt: Date;
}

const ExportJobSchema = new Schema<IExportJob>({
  report: { type: Schema.Types.ObjectId, ref: 'FinancialReport' },
  filename: { type: String, required: true },
  format: { type: String, enum: ['pdf','csv','xlsx'], required: true },
  status: { type: String, enum: ['ready','failed'], default: 'ready' }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default model<IExportJob>('ExportJob', ExportJobSchema);
