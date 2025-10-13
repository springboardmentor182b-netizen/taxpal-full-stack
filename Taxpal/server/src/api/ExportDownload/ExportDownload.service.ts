import { ExportRecordModel } from "./ExportDownload.model";
import { Parser } from "json2csv";
import XLSX from "xlsx";

export class ExportDownloadService {
  // Get all records
  async getAllRecords() {
    return await ExportRecordModel.find();
  }

  // Export as CSV
  async exportCSV() {
    const records = await ExportRecordModel.find().lean();
    if (records.length === 0) throw new Error("No data found to export");

    const fields = ["_id", "title", "amount", "category", "date"];
    const parser = new Parser({ fields });
    return parser.parse(records);
  }

  // Export as Excel
  async exportExcel() {
    const records = await ExportRecordModel.find().lean();
    if (records.length === 0) throw new Error("No data found to export");

    const worksheet = XLSX.utils.json_to_sheet(records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExportData");

    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  }
}
