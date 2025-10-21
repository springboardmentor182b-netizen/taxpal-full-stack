import { FinancialReportModel } from "./FinancialReport.model";
import { FinancialReport } from "./FinancialReport.types";
import { Parser } from "json2csv";
import XLSX from "xlsx";

export class FinancialReportService {
  async createReport(data: FinancialReport) {
    const report = new FinancialReportModel(data);
    return await report.save();
  }

  async getAllReports() {
    return await FinancialReportModel.find();
  }

  async deleteReport(id: string) {
    const result = await FinancialReportModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error("Report not found");
    }
    return result;
  }

  async exportCSV() {
    const reports = await FinancialReportModel.find().lean();
    if (reports.length === 0) throw new Error("No reports found");

    const fields = ["_id", "title", "amount", "category", "date"];
    const parser = new Parser({ fields });
    return parser.parse(reports);
  }

  async exportExcel() {
    const reports = await FinancialReportModel.find().lean();
    if (reports.length === 0) throw new Error("No reports found");

    const worksheet = XLSX.utils.json_to_sheet(reports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  }
}
