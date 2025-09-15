import mongoose, { Document, Schema } from 'mongoose';

export interface ITaxEstimate extends Document {
  user_id: mongoose.Types.ObjectId;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  estimated_tax: number;
  income_total: number;
  deductions_total: number;
  tax_rate: number;
  status: 'pending' | 'paid' | 'overdue';
  due_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaxEstimateSchema = new Schema<ITaxEstimate>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2030
  },
  estimated_tax: {
    type: Number,
    required: true,
    min: 0
  },
  income_total: {
    type: Number,
    required: true,
    min: 0
  },
  deductions_total: {
    type: Number,
    required: true,
    min: 0
  },
  tax_rate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  due_date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ITaxEstimate>('TaxEstimate', TaxEstimateSchema);
