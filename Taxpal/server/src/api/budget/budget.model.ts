import mongoose, { Schema, Document, Types, Model } from 'mongoose';

export interface IBudget extends Document {
  userId?: Types.ObjectId;
  category: string;
  amount: number;
  month: string;      // "YYYY-MM"
  monthStart: Date;   // normalized first day of month
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: false },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    month: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'month must be in YYYY-MM format']
    },
    monthStart: { type: Date, required: true },
    description: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

// Normalize monthStart if missing
BudgetSchema.pre('validate', function (next) {
  if (!this.monthStart && this.month) {
    const [y, m] = this.month.split('-').map(Number);
    this.monthStart = new Date(y, (m || 1) - 1, 1);
  }
  next();
});

// Unique per user+month+category (dev-friendly even without userId)
BudgetSchema.index(
  { userId: 1, month: 1, category: 1 },
  { unique: true, partialFilterExpression: { category: { $type: 'string' } } }
);

// Reuse existing model (fixes OverwriteModelError)
export const Budget: Model<IBudget> =
  (mongoose.models.Budget as Model<IBudget>) ||
  mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;
