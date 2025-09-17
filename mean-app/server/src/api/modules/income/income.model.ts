import mongoose, { Schema, Document } from 'mongoose';

export interface IIncome extends Document {
  userId: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  category: string;
  date: Date;
  notes: string;
}

const incomeSchema = new Schema<IIncome>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now },
  notes: String
}, { timestamps: true });

export const Income = mongoose.model<IIncome>('Income', incomeSchema);
