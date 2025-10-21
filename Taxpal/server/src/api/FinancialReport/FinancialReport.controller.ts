import { Request, Response } from "express";
import { FinancialReportService } from "./FinancialReport.service";

const service = new FinancialReportService();

export class FinancialReportController {
  async createReport(req: Request, res: Response) {
    try {
      const report = await service.createReport(req.body);
      res.status(201).json({ message: "Report created successfully", report });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating report", error: error.message });
    }
  }

  async getAllReports(req: Request, res: Response) {
    try {
      const reports = await service.getAllReports();
      res.status(200).json(reports);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching reports", error: error.message });
    }
  }

  async exportCSV(req: Request, res: Response) {
    try {
      const csv = await service.exportCSV();
      res.header("Content-Type", "text/csv");
      res.attachment("financial_reports.csv");
      res.send(csv);
    } catch (error: any) {
      res.status(500).json({ message: "Error exporting CSV", error: error.message });
    }
  }

  async exportExcel(req: Request, res: Response) {
    try {
      const buffer = await service.exportExcel();
      res.header(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.attachment("financial_reports.xlsx");
      res.send(buffer);
    } catch (error: any) {
      res.status(500).json({ message: "Error exporting Excel", error: error.message });
    }
  }
}
