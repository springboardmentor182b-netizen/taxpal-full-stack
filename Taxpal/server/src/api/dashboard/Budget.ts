import { Schema, model, Types, Document } from 'mongoose';

export interface BudgetDoc extends Document {
  userId: Types.ObjectId;
  month: number;   // 1..12
  year: number;    // e.g., 2025
  category: string;
  limit: number;   // planned cap for this category
  // (spent is computed at query time in your controller; not stored permanently)
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<BudgetDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 1970 },
    category: { type: String, required: true, trim: true },
    limit: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// One budget per (user, month, year, category)
BudgetSchema.index({ userId: 1, year: 1, month: 1, category: 1 }, { unique: true });

const Budget = model<BudgetDoc>('Budget', BudgetSchema);
export default Budget;
