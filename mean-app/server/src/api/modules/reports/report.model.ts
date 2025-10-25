//new
import mongoose, { Schema, Document, Model } from "mongoose";
import { ReportType, ReportPeriod, ReportFormat, ReportStatus, IReport } from "./report.types";

// Delete existing cached model to avoid OverwriteModelError in development
if (mongoose.models['Report']) {
  delete mongoose.models['Report'];
}

export interface IReportDocument extends Omit<IReport, "_id">, Document {}

const reportSchema = new Schema<IReportDocument>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    reportType: {
      type: String,
      enum: Object.values(ReportType),
      required: [true, "Report type is required"],
    },
    period: {
      type: String,
      enum: Object.values(ReportPeriod),
      required: [true, "Period is required"],
    },
    format: {
      type: String,
      enum: Object.values(ReportFormat),
      required: [true, "Format is required"],
      default: ReportFormat.PDF,
    },
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.PENDING,
    },
    reportData: {
      summary: {
        totalIncome: Number,
        totalExpense: Number,
        netIncome: Number,
        taxLiability: Number,
      },
      details: [Schema.Types.Mixed],
      charts: [Schema.Types.Mixed],
      period: {
        startDate: Date,
        endDate: Date,
      },
    },
    customPeriod: {
      startDate: Date,
      endDate: Date,
    },
    generatedAt: {
      type: Date,
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
   
  },
  {
    timestamps: true,
    collection: "reports",
  }
);

// Indexes for performance
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ status: 1 });

// Create the model
const Report: Model<IReportDocument> =
  mongoose.models.Report || mongoose.model<IReportDocument>("Report", reportSchema);

export default Report;
