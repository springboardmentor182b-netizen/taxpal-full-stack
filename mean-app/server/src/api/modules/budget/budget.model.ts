import { Schema, model } from 'mongoose';

export interface IBudget {
  category: string;
  amount: number;
  spent: number;
  remaining?: number;
  status?: 'Good' | 'Fair' | 'Poor';
  month: string;
  description?: string;
  userId: string;
}

const BudgetSchema = new Schema<IBudget>({
  category: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  month: { type: String, required: true },
  description: { type: String },
  spent: { type: Number, default: 0, min: 0 },
  userId: { type: String, required: true }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.remaining = ret.amount - (ret.spent || 0);
      return ret;
    }
  }
});

export const Budget = model<IBudget>('Budget', BudgetSchema);
