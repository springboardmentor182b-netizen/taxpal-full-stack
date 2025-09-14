import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  user_id: mongoose.Types.ObjectId;
  period: string; // e.g., "Jan 2025", "Q2 2024"
  report_type: 'summary' | 'detailed' | 'tax';
  file_path?: string;
  data: any; // Store report data as JSON
  generated_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    required: true,
    trim: true
  },
  report_type: {
    type: String,
    enum: ['summary', 'detailed', 'tax'],
    required: true
  },
  file_path: {
    type: String,
    trim: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  generated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IReport>('Report', ReportSchema);
