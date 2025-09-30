import { Schema, model, Document } from 'mongoose';

export interface IBudget {
  category: string;
  amount: number;
  month: string;
  description?: string;
  spent: number;
  userId: string;
}

const BudgetSchema = new Schema<IBudget>({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  description: { type: String },
  spent: { type: Number, default: 0 },
  userId: { type: String, required: true }
}, { timestamps: true });

export const Budget = model<IBudget>('Budget', BudgetSchema);
