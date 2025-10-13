import { Request, Response } from "express";
import { ExportDownloadService } from "./ExportDownload.service";

const service = new ExportDownloadService();

export class ExportDownloadController {
  async getAllRecords(req: Request, res: Response) {
    try {
      const data = await service.getAllRecords();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching data", error: error.message });
    }
  }

  async exportCSV(req: Request, res: Response) {
    try {
      const csv = await service.exportCSV();
      res.header("Content-Type", "text/csv");
      res.attachment("export_data.csv");
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
      res.attachment("export_data.xlsx");
      res.send(buffer);
    } catch (error: any) {
      res.status(500).json({ message: "Error exporting Excel", error: error.message });
    }
  }
}
