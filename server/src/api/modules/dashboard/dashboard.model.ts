import mongoose, { Schema, Document } from 'mongoose';

// Transaction interface
export interface ITransaction extends Document {
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: 'Income' | 'Expense';
}

// Transaction schema
const TransactionSchema = new Schema<ITransaction>({
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true }
});

// Dashboard interface
export interface IDashboard extends Document {
  monthlyIncome: number;
  monthlyExpenses: number;
  estimatedTaxDue: number;
  savingsRate: number;
  transactions: ITransaction[];
}

// Dashboard schema
const DashboardSchema = new Schema<IDashboard>({
  monthlyIncome: { type: Number, default: 0 },
  monthlyExpenses: { type: Number, default: 0 },
  estimatedTaxDue: { type: Number, default: 0 },
  savingsRate: { type: Number, default: 0 },
  transactions: [TransactionSchema]
});

export const DashboardModel = mongoose.model<IDashboard>('Dashboard', DashboardSchema);
