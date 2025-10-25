import { Request, Response } from "express";
import * as DashboardService from "./dashboard.service";
export const getDashboardController = async (req: Request, res: Response) => {
  const dashboard = await DashboardService.getDashboard(req.params.id);
  if (!dashboard) return res.status(404).json({ message: "Dashboard not found" });
  return res.json(dashboard);
};
export const addTransactionController = async (req: Request, res: Response) => {
  const { dashboardId } = req.params;
  const txData = req.body;
  const dashboard = await DashboardService.addTransaction(dashboardId, txData);
  if (!dashboard) return res.status(404).json({ message: "Dashboard not found" });
  return res.json(dashboard);
};
export const updateTransactionController = async (req: Request, res: Response) => {
  const { dashboardId, txId } = req.params;
  const txData = req.body;
  const dashboard = await DashboardService.updateTransaction(dashboardId, txId, txData);
  if (!dashboard) return res.status(404).json({ message: "Dashboard or transaction not found" });
  return res.json(dashboard);
};
export const deleteTransactionController = async (req: Request, res: Response) => {
  const { dashboardId, txId } = req.params;
  const dashboard = await DashboardService.deleteTransaction(dashboardId, txId);
  if (!dashboard) return res.status(404).json({ message: "Dashboard or transaction not found" });
  return res.json(dashboard);
};
// Upsert dashboard (create if not exists)
export const upsertDashboardController = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // No need to pass `data`; service will calculate from Income & Expense collections
    const dashboard = await DashboardService.upsertDashboard(userId);
    res.json(dashboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}