import { DashboardModel, IDashboard, ITransaction } from "./dashboard.model";
import { Income } from "../income/income.model";
import { Expense } from "../expense/expense.model";

/**
 * Fetch the dashboard for a user
 * Returns only dashboard.transactions (user-added) in the array
 * Calculates totals from Income/Expense collections
 */
export const getDashboard = async (userId: string) => {
  const dashboard = await DashboardModel.findOne({ user: userId });
  if (!dashboard) return null;

  // Only user-added transactions are returned
  const allTransactions = [...dashboard.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate totals from Income/Expense collections
  const totalIncomeAgg = await Income.aggregate([
    { $match: { userId } },
    { $group: { _id: null, sum: { $sum: "$amount" } } }
  ]);
  const totalExpensesAgg = await Expense.aggregate([
    { $match: { userId } },
    { $group: { _id: null, sum: { $sum: "$amount" } } }
  ]);

  const totalIncome = totalIncomeAgg[0]?.sum || 0;
  const totalExpenses = totalExpensesAgg[0]?.sum || 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return {
    ...dashboard.toObject(),
    monthlyIncome: totalIncome,
    monthlyExpenses: totalExpenses,
    savingsRate,
    transactions: allTransactions
  };
};

// Add a user-created transaction
export const addTransaction = async (dashboardId: string, txData: Partial<ITransaction>) => {
  const dashboard = await DashboardModel.findById(dashboardId);
  if (!dashboard) return null;

  dashboard.transactions.push(txData as ITransaction);
  await dashboard.save();
  return dashboard;
};

// Update a user-created transaction
export const updateTransaction = async (dashboardId: string, txId: string, txData: Partial<ITransaction>) => {
  const dashboard = await DashboardModel.findById(dashboardId);
  if (!dashboard) return null;

  const tx = dashboard.transactions.id(txId);
  if (!tx) return null;

  tx.set(txData);
  await dashboard.save();
  return dashboard;
};

// Delete a user-created transaction
export const deleteTransaction = async (dashboardId: string, txId: string) => {
  const dashboard = await DashboardModel.findById(dashboardId);
  if (!dashboard) return null;

  const tx = dashboard.transactions.id(txId);
  if (!tx) return null;

  await tx.deleteOne();
  await dashboard.save();
  return dashboard;
};

// Create or update dashboard
export const upsertDashboard = async (userId: string) => {
  const incomes = await Income.find({ userId });
  const expenses = await Expense.find({ userId });

  const monthlyIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const monthlyExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const estimatedTaxDue = monthlyIncome * 0.1;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  // Only keep user-added transactions in dashboard.transactions
  let dashboard = await DashboardModel.findOne({ user: userId });
  if (!dashboard) {
    dashboard = new DashboardModel({
      user: userId,
      monthlyIncome,
      monthlyExpenses,
      estimatedTaxDue,
      savingsRate,
      transactions: []
    });
  } else {
    dashboard.set({
      monthlyIncome,
      monthlyExpenses,
      estimatedTaxDue,
      savingsRate
      // Do not overwrite transactions to avoid duplicates
    });
  }

  await dashboard.save();
  return dashboard;
};
