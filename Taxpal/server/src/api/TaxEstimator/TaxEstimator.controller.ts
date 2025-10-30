import { Request, Response } from "express";
import { TaxEstimatorService } from "./TaxEstimator.service";

export class TaxEstimatorController {
  // ----- TAX ESTIMATION -----
  static async estimateTax(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await TaxEstimatorService.calculateTax(data);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllTaxRecords(req: Request, res: Response) {
    try {
      const records = await TaxEstimatorService.getAllTaxRecords();
      res.status(200).json({ success: true, data: records });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ----- TAX CALENDAR -----
  static async addCalendarEvent(req: Request, res: Response) {
    try {
      const event = await TaxEstimatorService.addCalendarEvent(req.body);
      res.status(201).json({ success: true, data: event });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllCalendarEvents(req: Request, res: Response) {
    try {
      const events = await TaxEstimatorService.getAllCalendarEvents();
      res.status(200).json({ success: true, data: events });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteCalendarEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await TaxEstimatorService.deleteCalendarEvent(id);
      if (!deleted)
        return res.status(404).json({ success: false, message: "Event not found" });
      res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ✅ NEW: bulk delete based on query (?type=reminder)
  static async deleteCalendarBulk(req: Request, res: Response) {
    try {
      const { type } = req.query;
      if (type === 'reminder') {
        const deletedCount = await TaxEstimatorService.deleteAllReminders();
        return res.status(200).json({ success: true, deletedCount });
      }
      return res.status(400).json({ success: false, message: "Unsupported bulk delete filter" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
