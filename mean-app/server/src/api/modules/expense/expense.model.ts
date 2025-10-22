import mongoose, { Document } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
}

const expenseSchema = new mongoose.Schema<IExpense>(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    amount:      { type: Number, required: true },
    category:    { type: String, required: true },
    date:        { type: Date, required: true },
    notes:       { type: String },
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
