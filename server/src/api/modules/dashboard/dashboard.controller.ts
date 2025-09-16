import { Request, Response } from 'express';
import { getDashboardData, createDashboard } from './dashboard.service';

// GET /api/v1/dashboard/:id
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const dashboard = await getDashboardData(req.params.id);
    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    res.status(200).json(dashboard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

// POST /api/v1/dashboard
export const addDashboard = async (req: Request, res: Response) => {
  try {
    const dashboard = await createDashboard(req.body);
    res.status(201).json(dashboard);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create dashboard' });
  }
};
