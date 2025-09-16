import { DashboardModel } from './dashboard.model';

// Fetch dashboard by ID
export const getDashboardData = async (id: string) => {
  return await DashboardModel.findById(id);
};

// Create new dashboard
export const createDashboard = async (data: any) => {
  const dashboard = new DashboardModel(data);
  return await dashboard.save();
};
