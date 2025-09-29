import mongoose, { Document, Schema } from "mongoose";

export interface ITaxEstimate extends Document {
  user_id: mongoose.Types.ObjectId;
  country: string;
  state: string;
  quarter: string;
  estimated_tax: number;
  due_date?: Date;
  filing_status: string;
  gross_income_for_quarter: number;
  business_expenses: number;
  retirement_contribution: number;
  health_insurance_premiums: number;
  home_office_deduction: number;
}

const taxEstimatorSchema = new Schema<ITaxEstimate>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    quarter: { type: String, required: true },
    estimated_tax: { type: Number, default: 0 },
    due_date: { type: Date },
    filing_status: { type: String, required: true },
    gross_income_for_quarter: { type: Number, required: true },
    business_expenses: { type: Number, default: 0 },
    retirement_contribution: { type: Number, default: 0 },
    health_insurance_premiums: { type: Number, default: 0 },
    home_office_deduction: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export default mongoose.model<ITaxEstimate>(
  "TaxEstimate",
  taxEstimatorSchema
);
