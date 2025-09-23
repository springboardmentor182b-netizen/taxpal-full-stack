import { Schema, model, Document } from "mongoose";

export interface IBudget extends Document {
  category: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  month: string;
  amount: number;
  description?: string;
  spent: number;
  remaining: number;
  status: string;
}

const BudgetSchema = new Schema<IBudget>(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true }, // e.g. "2025-05"
    amount: { type: Number, required: true },
    description: { type: String },
    spent: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Virtuals
BudgetSchema.virtual("remaining").get(function (this: IBudget) {
  return this.amount - this.spent;
});

BudgetSchema.virtual("status").get(function (this: IBudget) {
  if (this.spent < this.amount * 0.8) return "Good";
  if (this.spent <= this.amount) return "Warning";
  return "Over Budget";
});

export const Budget = model<IBudget>("Budget", BudgetSchema);
