import { Request, Response } from 'express';
import { buildReportBuffer } from './ExportDownload.service';

export async function preview(req: Request, res: Response) {
  const { id, reportType, format } = req.body || {};
  const result = await buildReportBuffer({ reportId: id, reportType, format });
  const base64 = result.mime === 'application/pdf' ? result.buf.toString('base64') : undefined;
  res.json({ filename: result.filename, mimeType: result.mime, base64 });
}

export async function download(req: Request, res: Response) {
  const { id, reportType, format } = req.body || {};
  const result = await buildReportBuffer({ reportId: id, reportType, format });
  res.setHeader('Content-Type', result.mime);
  res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
  res.end(result.buf);
}
