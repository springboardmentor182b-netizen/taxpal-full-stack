// server/src/models/models.ts
import mongoose, { Schema, Document,Types } from "mongoose";

//
// Transaction Interface & Schema
//
export interface ITransaction {
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: "Income" | "Expense";
}

const TransactionSchema = new Schema<ITransaction>(
  {
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["Income", "Expense"], required: true }
  },
  { _id: true }
);

//
// Dashboard Interface & Schema
//
export interface IDashboard extends Document {
  user: mongoose.Types.ObjectId;
  monthlyIncome: number;
  monthlyExpenses: number;
  estimatedTaxDue: number;
  savingsRate: number;
   transactions: Types.DocumentArray<ITransaction>; 
  createdAt?: Date;
  updatedAt?: Date;
}

const DashboardSchema = new Schema<IDashboard>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    monthlyIncome: { type: Number, default: 0 },
    monthlyExpenses: { type: Number, default: 0 },
    estimatedTaxDue: { type: Number, default: 0 },
    savingsRate: { type: Number, default: 0 },
    transactions: [TransactionSchema]
  },
  { timestamps: true }
);

//
// Report Interface & Schema
//
export interface IReport extends Document {
  user: mongoose.Types.ObjectId;
  dashboard: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const ReportSchema = new Schema<IReport>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dashboard: { type: Schema.Types.ObjectId, ref: "Dashboard", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);
export const DashboardModel = mongoose.model<IDashboard>("Dashboard", DashboardSchema);
export const ReportModel = mongoose.model<IReport>("Report", ReportSchema);