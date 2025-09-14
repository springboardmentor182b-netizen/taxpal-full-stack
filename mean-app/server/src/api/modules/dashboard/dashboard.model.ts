import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  monthlyIncome: {
    type: Number,
    default: 0
  },
  monthlyExpenses: {
    type: Number,
    default: 0
  },
  estimatedTaxDue: {
    type: Number,
    default: 0
  },
  savingsRate: {
    type: Number,
    default: 0
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ],
  budgets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget'
    }
  ]
});

const User = mongoose.model('User', userSchema);
export default User; 