
import { DashboardModel, IDashboard, ITransaction } from "./dashboard.model";

export const getDashboard = async (dashboardId: string) => {
  const dashboard = await DashboardModel.findById(dashboardId);
  if (!dashboard) return null;

  return dashboard;
};

// Add, update, delete transactions and compute stats
export const addTransaction = async (dashboardId: string, txData: Partial<ITransaction>) => {
  const dashboard = await DashboardModel.findById(dashboardId);
  if (!dashboard) return null;
  dashboard.transactions.push(txData as ITransaction);
  await dashboard.save();
  return dashboard;
};
export const updateTransaction = async (dashboardId: string, txId: string, txData: Partial<ITransaction>) => {
  const dashboard = await DashboardModel.findById(dashboardId);
  if (!dashboard) return null;
  const tx = dashboard.transactions.id(txId);
  if (!tx) return null;
  tx.set(txData);
  await dashboard.save();
  return dashboard;
};
export const deleteTransaction = async (dashboardId: string, txId: string) => {
  const dashboard = await DashboardModel.findById(dashboardId);
  if (!dashboard) return null;

  const tx = dashboard.transactions.id(txId);
  if (!tx) return null;
 await tx.deleteOne();
await dashboard.save();
  return dashboard;
};
