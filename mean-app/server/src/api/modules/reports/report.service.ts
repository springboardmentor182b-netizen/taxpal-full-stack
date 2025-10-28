
import Report, { IReportDocument } from "./report.model";
import { ReportType, ReportPeriod, ReportFormat, ReportStatus } from "./report.types";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Income } from "../income/income.model";
import { Expense } from "../expense/expense.model";
import { Budget } from "../budget/budget.model";
import mongoose from "mongoose";

class ReportService {
  private calculateDateRange(period: ReportPeriod, customPeriod?: { startDate: Date; endDate: Date }) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    switch (period) {
      case ReportPeriod.CURRENT_MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;

      case ReportPeriod.LAST_MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;

      case ReportPeriod.CURRENT_QUARTER:
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        endDate = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0, 23, 59, 59);
        break;

      case ReportPeriod.LAST_QUARTER:
        const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
        const year = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
        const quarter = lastQuarter < 0 ? 3 : lastQuarter;
        startDate = new Date(year, quarter * 3, 1);
        endDate = new Date(year, (quarter + 1) * 3, 0, 23, 59, 59);
        break;

      case ReportPeriod.CURRENT_YEAR:
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;

      case ReportPeriod.LAST_YEAR:
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        break;

      case ReportPeriod.CUSTOM:
        if (!customPeriod) throw new Error("Custom period dates are required");
        startDate = new Date(customPeriod.startDate);
        endDate = new Date(customPeriod.endDate);
        break;

      default:
        throw new Error("Invalid period");
    }

    return { startDate, endDate };
  }

  // Helper method to get months in range for Budget queries
  private getMonthsInRange(startDate: Date, endDate: Date): string[] {
    const months: string[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      months.push(`${year}-${month}`);
      
      // Move to next month
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  }

  private async generateReportData(
    userId: string,
    reportType: ReportType,
    startDate: Date,
    endDate: Date
  ) {
    const reportData: any = {
      period: { startDate, endDate },
      summary: {},
      details: [],
      charts: []
    };

    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      if (reportType === ReportType.INCOME_STATEMENT) {
        const incomes = await Income.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
        const expenses = await Expense.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();

        const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

        reportData.summary = {
          totalIncome,
          totalExpense,
          netIncome: totalIncome - totalExpense
        };

        reportData.details = { incomes, expenses };
      }

      if (reportType === ReportType.EXPENSE_REPORT) {
        const expenses = await Expense.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

        reportData.summary = { totalExpense };
        reportData.details = expenses;
      }

      if (reportType === ReportType.TAX_SUMMARY) {
        const incomes = await Income.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
        const expenses = await Expense.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();

        const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
        const taxableIncome = totalIncome - totalExpense;
        const taxRate = 0.1; // example 10%
        const taxLiability = taxableIncome > 0 ? taxableIncome * taxRate : 0;

        reportData.summary = { totalIncome, totalExpense, taxableIncome, taxLiability };
        reportData.details = { incomes, expenses };
      }

      if (reportType === ReportType.BUDGET_ANALYSIS) {
        // Convert date range to month format (YYYY-MM)
        const months = this.getMonthsInRange(startDate, endDate);
        
        // Query budgets by month instead of date
        const budgets = await Budget.find({ 
          userId: userObjectId, 
          month: { $in: months } 
        }).lean();
        
        const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
        const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);

        reportData.summary = { 
          totalBudget, 
          totalSpent, 
          remaining: totalBudget - totalSpent 
        };
        reportData.details = budgets;
      }

      if (reportType === ReportType.CASH_FLOW) {
        const incomes = await Income.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();
        const expenses = await Expense.find({ userId: userObjectId, date: { $gte: startDate, $lte: endDate } }).lean();

        const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

        reportData.summary = {
          openingBalance: 0, 
          totalIncome,
          totalExpense,
          netCashFlow: totalIncome - totalExpense,
          closingBalance: totalIncome - totalExpense
        };
        reportData.details = { incomes, expenses };
      }

      return reportData;
    } catch (error: any) {
      console.error("Error generating report data:", error);
      throw new Error(`Failed to generate report data: ${error.message}`);
    }
  }

  private async processReportGeneration(
    reportId: string,
    userId: string,
    reportType: ReportType,
    startDate: Date,
    endDate: Date
  ) {
    try {
      await Report.findByIdAndUpdate(reportId, { status: ReportStatus.GENERATING });

      const reportData = await this.generateReportData(userId, reportType, startDate, endDate);

      const fileName = `${reportType.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, "../../../public/reports", fileName);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));

      doc.fontSize(20).text(`${reportType} Report`, { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Period: ${startDate.toDateString()} - ${endDate.toDateString()}`);
      doc.moveDown();
      doc.text("Summary:");
      doc.moveDown();
      for (const key in reportData.summary) {
        doc.text(`${key}: ${reportData.summary[key]}`);
      }

      doc.end();

      await Report.findByIdAndUpdate(reportId, {
        status: ReportStatus.COMPLETED,
        reportData,
        generatedAt: new Date(),
        fileName,
        fileUrl: `/reports/${fileName}`
      });
    } catch (error: any) {
      console.error("Report generation error:", error);
      await Report.findByIdAndUpdate(reportId, {
        status: ReportStatus.FAILED,
        errorMessage: error.message
      });
    }
  }

  async createReport(data: {
    userId: string;
    reportType: ReportType;
    period: ReportPeriod;
    format: ReportFormat;
    customPeriod?: { startDate: Date; endDate: Date };
  }): Promise<IReportDocument> {
    try {
      const { startDate, endDate } = this.calculateDateRange(data.period, data.customPeriod);

      const report = new Report({
        userId: data.userId,
        reportType: data.reportType,
        period: data.period,
        format: data.format,
        status: ReportStatus.PENDING,
        customPeriod: data.customPeriod
      });

      await report.save();
      this.processReportGeneration(report._id.toString(), data.userId, data.reportType, startDate, endDate);

      return report;
    } catch (error: any) {
      throw new Error(`Failed to create report: ${error.message}`);
    }
  }

  async getUserReports(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const reports = await Report.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Report.countDocuments({ userId });
    return { reports, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getReportById(reportId: string, userId: string): Promise<IReportDocument | null> {
    return await Report.findOne({ _id: reportId, userId });
  }

  async deleteReport(reportId: string, userId: string): Promise<boolean> {
    const result = await Report.deleteOne({ _id: reportId, userId });
    return result.deletedCount > 0;
  }

  async getReportStats(userId: string) {
    const stats = await Report.aggregate([
      { $match: { userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    return stats.reduce((acc: any, stat: any) => { acc[stat._id] = stat.count; return acc; }, {});
  }
}
  
export default new ReportService();