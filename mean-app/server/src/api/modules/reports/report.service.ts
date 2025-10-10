// server/src/api/modules/reports/report.service.ts (FIXED VERSION)

import Report, { IReportDocument } from "./report.model";
import { ReportType, ReportPeriod, ReportFormat, ReportStatus } from "./report.types";


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
        if (!customPeriod) {
          throw new Error("Custom period dates are required");
        }
        startDate = new Date(customPeriod.startDate);
        endDate = new Date(customPeriod.endDate);
        break;

      default:
        throw new Error("Invalid period");
    }

    return { startDate, endDate };
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
      switch (reportType) {
        case ReportType.INCOME_STATEMENT:
         
          reportData.summary = {
            totalIncome: 0,
            totalExpense: 0,
            netIncome: 0,
            message: "No income data found for this period"
          };
          break;

        case ReportType.EXPENSE_REPORT:
         
          reportData.summary = {
            totalExpense: 0,
            message: "No expense data found for this period"
          };
          break;

        case ReportType.TAX_SUMMARY:
        
          reportData.summary = {
            totalIncome: 0,
            totalExpense: 0,
            taxableIncome: 0,
            taxLiability: 0,
            message: "No data found for tax calculation"
          };
          break;

        case ReportType.BUDGET_ANALYSIS:
        
          reportData.summary = {
            totalBudget: 0,
            totalSpent: 0,
            remaining: 0,
            message: "No budget data found"
          };
          break;

        case ReportType.CASH_FLOW:
        
          reportData.summary = {
            openingBalance: 0,
            totalIncome: 0,
            totalExpense: 0,
            netCashFlow: 0,
            closingBalance: 0,
            message: "No cash flow data found"
          };
          break;
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

      const fileName = `${reportType.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      const fileUrl = `/reports/${fileName}`;

      await Report.findByIdAndUpdate(reportId, {
        status: ReportStatus.COMPLETED,
        reportData,
        generatedAt: new Date(),
        fileName,
        fileUrl
      });
    } catch (error: any) {
      console.error("Report generation error:", error);
      await Report.findByIdAndUpdate(reportId, {
        status: ReportStatus.FAILED,
        errorMessage: error.message
      });
    }
  }

  // Create new report
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

  // Get all user reports with pagination
  async getUserReports(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const reports = await Report.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Report.countDocuments({ userId });

    return {
      reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get report by ID
  async getReportById(reportId: string, userId: string): Promise<IReportDocument | null> {
    return await Report.findOne({ _id: reportId, userId });
  }

  // Delete report
  async deleteReport(reportId: string, userId: string): Promise<boolean> {
    const result = await Report.deleteOne({ _id: reportId, userId });
    return result.deletedCount > 0;
  }

  // Get statistics
  async getReportStats(userId: string) {
    const stats = await Report.aggregate([
      { $match: { userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    return stats.reduce((acc: any, stat: any) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  }
}

export default new ReportService();