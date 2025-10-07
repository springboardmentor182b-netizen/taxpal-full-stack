import mongoose, { Document, Schema } from "mongoose";

export interface ITaxReminder extends Document {
  user_id: mongoose.Types.ObjectId;
  quarter: string;
  due_date: Date;
  status: "reminder" | "payment_done";
  amount: number;
}

const taxReminderSchema = new Schema<ITaxReminder>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quarter: { type: String, required: true },
    due_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["reminder", "payment_done"],
      default: "reminder",
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITaxReminder>("TaxReminder", taxReminderSchema);
