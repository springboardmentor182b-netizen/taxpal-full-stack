import { Schema, model } from 'mongoose';

const IncomeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },

    // You can send either `source` or `description` from the client.
    source: { type: String, required: true, alias: 'description' },

    category: { type: String, default: 'General' },
    amount: { type: Number, required: true, min: 0 },

    date: { type: Date, required: true, default: () => new Date() },

    notes: { type: String }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },   // <— include alias in API responses
    toObject: { virtuals: true }
  }
);

// Useful for dashboards and date filtering
IncomeSchema.index({ userId: 1, date: -1 });

export default model('Income', IncomeSchema);
