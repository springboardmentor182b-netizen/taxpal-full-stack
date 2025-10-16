import { Request, Response } from "express";
import { TaxEstimatorService } from "./TaxEstimator.service";

export class TaxEstimatorController {
  static async estimateTax(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await TaxEstimatorService.calculateTax(data);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllRecords(req: Request, res: Response) {
    try {
      const records = await TaxEstimatorService.getAllRecords();
      res.status(200).json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
