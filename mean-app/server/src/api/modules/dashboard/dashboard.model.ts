import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  estimatedTaxDue: number;
  savingsRate: number;
  transactions: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  monthlyIncome: { type: Number, default: 0 },
  monthlyExpenses: { type: Number, default: 0 },
  estimatedTaxDue: { type: Number, default: 0 },
  savingsRate: { type: Number, default: 0 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
});


export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: 'Income' | 'Expense';
}

const TransactionSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true }
});

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
