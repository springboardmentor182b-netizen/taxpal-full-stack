
import { DashboardModel, IDashboard, ITransaction } from "./dashboard.model";
import { Income } from "../income/income.model";
import { Expense } from "../expense/expense.model";

export const getDashboard = async (userId: string) => {
  // Fetch the dashboard document
  const dashboard = await DashboardModel.findOne({ user: userId });
  if (!dashboard) return null;

  // Fetch incomes & expenses separately
  const incomes = await Income.find({ userId }).lean();
  const expenses = await Expense.find({ userId }).lean();

  // Normalize incomes to match transaction format
  const incomeTransactions = incomes.map((inc) => ({
    date: inc.date,
    description: inc.description,
    category: inc.category,
    amount: inc.amount,
    type: "Income"
  }));

  // Normalize expenses to match transaction format
  const expenseTransactions = expenses.map((exp) => ({
    date: exp.date,
    description: exp.description,
    category: exp.category,
    amount: exp.amount,
    type: "Expense"
  }));

  // Merge all transactions
  const allTransactions = [
    ...dashboard.transactions, // existing from dashboard
    ...incomeTransactions,
    ...expenseTransactions
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Recalculate dashboard metrics
  const totalIncome = allTransactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = allTransactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return {
    ...dashboard.toObject(),
    monthlyIncome: totalIncome,
    monthlyExpenses: totalExpenses,
    savingsRate,
    transactions: allTransactions
  };
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

export const upsertDashboard = async (userId: string) => {
  // Get all incomes & expenses for this user
  const incomes = await Income.find({ userId });
  const expenses = await Expense.find({ userId });

  // Calculate totals
  const monthlyIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const monthlyExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const estimatedTaxDue = monthlyIncome * 0.1;
  const savingsRate =
    monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
      : 0;

  // Convert incomes & expenses into plain transaction objects
  const transactions = [
    ...incomes.map((i) => ({
      date: i.date,
      description: i.description,
      category: i.category,
      amount: i.amount,
      type: "Income" as const,
    })),
    ...expenses.map((e) => ({
      date: e.date,
      description: e.description,
      category: e.category,
      amount: e.amount,
      type: "Expense" as const,
    })),
  ];

  // Find or create dashboard
  let dashboard = await DashboardModel.findOne({ user: userId });

  if (!dashboard) {
    dashboard = new DashboardModel({
      user: userId,
      monthlyIncome,
      monthlyExpenses,
      estimatedTaxDue,
      savingsRate,
      transactions, // Mongoose will cast this array to DocumentArray
    });
  } else {
    dashboard.set({
      monthlyIncome,
      monthlyExpenses,
      estimatedTaxDue,
      savingsRate,
      transactions, // cast with set() ensures proper DocumentArray
    });
  }

  await dashboard.save();
  return dashboard;
}