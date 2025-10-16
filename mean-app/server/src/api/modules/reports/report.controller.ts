import { Request, Response } from "express";
import reportService from "./report.service";
import { ReportType, ReportPeriod, ReportFormat } from "./report.types";
import path from 'path';
import fs from 'fs';

class ReportController {
 
  async generateReport(req: Request, res: Response): Promise<Response> {
    try {
      const { reportType, period, format = ReportFormat.PDF, customPeriod } = req.body;

    
      if (!reportType || !Object.values(ReportType).includes(reportType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid report type"
        });
      }

      if (!period || !Object.values(ReportPeriod).includes(period)) {
        return res.status(400).json({
          success: false,
          message: "Invalid period"
        });
      }

      if (period === ReportPeriod.CUSTOM) {
        if (!customPeriod || !customPeriod.startDate || !customPeriod.endDate) {
          return res.status(400).json({
            success: false,
            message: "Custom period requires startDate and endDate"
          });
        }

        const startDate = new Date(customPeriod.startDate);
        const endDate = new Date(customPeriod.endDate);

        if (startDate >= endDate) {
          return res.status(400).json({
            success: false,
            message: "Start date must be before end date"
          });
        }
      }

      const userId = (req as any).user?.id || (req as any).user?._id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required. Please login to generate reports."
        });
      }

      const report = await reportService.createReport({
        userId,
        reportType,
        period,
        format,
        customPeriod
      });

      return res.status(201).json({
        success: true,
        message: "Report generation started",
        data: report
      });
    } catch (error: any) {
      console.error("Generate report error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to generate report"
      });
    }
  }


  async getReports(req: Request, res: Response): Promise<Response> {
    try {
     
      const userId = (req as any).user?.id || (req as any).user?._id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await reportService.getUserReports(userId, page, limit);

      return res.status(200).json({
        success: true,
        data: result.reports,
        pagination: result.pagination
      });
    } catch (error: any) {
      console.error("Get reports error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch reports"
      });
    }
  }

  
  async getReportById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      
      const userId = (req as any).user?.id || (req as any).user?._id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      if (!id || id.length !== 24) {
        return res.status(400).json({
          success: false,
          message: "Invalid report ID"
        });
      }

      const report = await reportService.getReportById(id, userId);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: report
      });
    } catch (error: any) {
      console.error("Get report error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch report"
      });
    }
  }

 
  async deleteReport(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      const userId = (req as any).user?.id || (req as any).user?._id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      if (!id || id.length !== 24) {
        return res.status(400).json({
          success: false,
          message: "Invalid report ID"
        });
      }

      const deleted = await reportService.deleteReport(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Report not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Report deleted successfully"
      });
    } catch (error: any) {
      console.error("Delete report error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete report"
      });
    }
  }

  //new

  async downloadReport(req: Request, res: Response): Promise<Response | void> {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });

    const report = await reportService.getReportById(id, userId);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    if (report.status !== "completed") return res.status(400).json({ success: false, message: `Report is ${report.status}. Cannot download yet.` });

    if (!report.fileUrl) return res.status(404).json({ success: false, message: "File not available" });

    const filePath = path.join(__dirname, '../../../public', report.fileUrl); // adjust path to your public folder
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: "File not found on server" });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error: any) {
    console.error("Download report error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to download report" });
  }
}

  
  async getStats(req: Request, res: Response): Promise<Response> {
    try {
    
      const userId = (req as any).user?.id || (req as any).user?._id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      const stats = await reportService.getReportStats(userId);

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      console.error("Get stats error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch statistics"
      });
    }
  }
}

export default new ReportController();