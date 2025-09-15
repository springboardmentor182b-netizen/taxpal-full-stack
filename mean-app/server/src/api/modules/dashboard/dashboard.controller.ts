import { Request, Response } from 'express';
import { getDashboardSummary } from './dashboard.service';

export const getSummary = async (req: Request, res: Response) => {
  try {
    const data = await getDashboardSummary();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
