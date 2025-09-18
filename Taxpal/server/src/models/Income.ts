import { Schema, model } from 'mongoose';

const IncomeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  source: { type: String, required: true },        // or "description"
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true });

export default model('Income', IncomeSchema);
