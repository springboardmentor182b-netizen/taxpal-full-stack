import { Request, Response } from 'express';
import { createReport, listReports, getReport, deleteReport } from './FinancialReport.service';

export async function generate(req: Request, res: Response) {
  const { reportType, period, format } = req.body || {};
  if (!reportType || !period || !format) {
    return res.status(400).json({ success:false, message:'reportType, period, format are required' });
  }
  const doc = await createReport(reportType, period, format, (req as any).user?._id);
  res.json({ success:true, data: doc });
}

export async function list(req: Request, res: Response) {
  const items = await listReports();
  res.json({ success:true, data: items });
}

export async function byId(req: Request, res: Response) {
  const item = await getReport(req.params.id);
  if (!item) return res.status(404).json({ success:false, message:'Not found' });
  res.json({ success:true, data: item });
}

export async function remove(req: Request, res: Response) {
  await deleteReport(req.params.id);
  res.json({ success:true });
}
