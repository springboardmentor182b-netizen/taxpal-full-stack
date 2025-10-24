import { Request, Response } from 'express';
import * as ReportService from './reportexport.service';
import path from 'path';
import fs from 'fs-extra';

export async function generate(req: Request, res: Response) {
  try {
    const { user_id, period, report_type } = req.body;

    if (!user_id || !period || !report_type) {
      return res.status(400).json({ message: 'user_id, period, and report_type are required.' });
    }

    const report = await ReportService.generateReport(user_id, period, report_type);
    return res.status(201).json({
      id: report._id,
      user_id: report.user_id,
      period: report.period,
      report_type: report.report_type,
      file_path: report.file_path,
      download_url: `/api/v1/reportexports/download/${report._id}`,
    });
  } catch (err) {
    console.error('Error generating report:', err);
    return res.status(500).json({ message: 'Failed to generate report', error: String(err) });
  }
}

export async function download(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const report = await ReportService.getReportById(id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (!await fs.pathExists(report.file_path)) {
      return res.status(410).json({ message: 'Report file missing' });
    }

    res.download(report.file_path);
  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({ message: 'Failed to download report', error: String(err) });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'user_id is required' });

    const reports = await ReportService.getReportsByUser(user_id as string);
    return res.status(200).json(reports);
  } catch (err) {
    console.error('List reports error:', err);
    return res.status(500).json({ message: 'Failed to fetch reports', error: String(err) });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await ReportService.deleteReport(id);
    if (!deleted) return res.status(404).json({ message: 'Report not found' });
    return res.status(200).json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ message: 'Failed to delete report', error: String(err) });
  }
}
