import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  user_id: mongoose.Types.ObjectId;
  category: string;
  limit: number;
  month: string; // Format: "YYYY-MM"
  spent?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  limit: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<IBudget>('Budget', BudgetSchema);
