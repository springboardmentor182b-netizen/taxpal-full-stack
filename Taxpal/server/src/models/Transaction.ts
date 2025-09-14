import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  user_id: mongoose.Types.ObjectId;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
