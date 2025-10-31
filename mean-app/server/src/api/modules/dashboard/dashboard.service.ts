import { DashboardModel, IDashboard, ITransaction } from "./dashboard.model";
import { Income } from "../income/income.model";
import { Expense } from "../expense/expense.model";
import mongoose, { Types } from "mongoose";


/**
 * Fetch the dashboard for a user
 * Returns only dashboard.transactions (user-added) in the array
 * Calculates totals from Income/Expense collections
 */
export const getDashboard = async (userId: string) => {
  const dashboard = await DashboardModel.findOne({ user: userId });
  if (!dashboard) return null;

  // Fetch real-time transactions directly from Income/Expense
  const incomes = await Income.find({ userId });
  const expenses = await Expense.find({ userId });

  const allTransactions = [
    ...incomes.map((inc) => ({
      _id: inc._id,
      type: 'Income',
      description: inc.description,
      amount: inc.amount,
      category: inc.category,
      date: inc.date,
      refId: inc._id,
    })),
    ...expenses.map((exp) => ({
      _id: exp._id,
      type: 'Expense',
      description: exp.description,
      amount: exp.amount,
      category: exp.category,
      date: exp.date,
      refId: exp._id,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return {
    ...dashboard.toObject(),
    monthlyIncome: totalIncome,
    monthlyExpenses: totalExpenses,
    savingsRate,
    transactions: allTransactions
  };
};

export const addTransaction = async (dashboardId: string, txData: Partial<ITransaction>) => {
  const dashboard = await DashboardModel.findById(dashboardId);
  if (!dashboard) return null;

  // Ensure required fields exist
  if (!txData.type || !txData.amount || !txData.category || !txData.description) {
    throw new Error("Missing required transaction fields");
  }

  // Check if identical Income/Expense already exists
  const matchQuery = {
    userId: dashboard.user,
    description: txData.description,
    amount: txData.amount,
    category: txData.category,
    date: txData.date,
  };

  let refDoc = null;

  if (txData.type === "Income") {
    const existingIncome = await Income.findOne(matchQuery);
    if (existingIncome) {
      console.log("⚠️ Duplicate Income prevented:", existingIncome._id);
      refDoc = existingIncome;
    } else {
      refDoc = await Income.create({
        ...matchQuery,
        date: txData.date || new Date(),
      });
    }
  } else if (txData.type === "Expense") {
    const existingExpense = await Expense.findOne(matchQuery);
    if (existingExpense) {
      console.log("⚠️ Duplicate Expense prevented:", existingExpense._id);
      refDoc = existingExpense;
    } else {
      refDoc = await Expense.create({
        ...matchQuery,
        date: txData.date || new Date(),
      });
    }
  }

  // Create dashboard transaction only if it doesn't exist
  const alreadyInDashboard = dashboard.transactions.some(
    (tx) =>
      tx.description === txData.description &&
      tx.amount === txData.amount &&
      tx.category === txData.category &&
      tx.type === txData.type &&
      tx.date.toISOString() === new Date(txData.date || "").toISOString()
  );

  if (!alreadyInDashboard) {
    const transactionWithRef = {
      ...txData,
      refId: refDoc?._id,
    };
    dashboard.transactions.push(transactionWithRef as ITransaction);
    await dashboard.save();
  } else {
    console.log("⚠️ Duplicate transaction prevented in dashboard.transactions");
  }

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
export const updateDashboard = async (dashboardId: string, data: Partial<IDashboard>) => {
  const dashboard = await DashboardModel.findByIdAndUpdate(dashboardId, data, { new: true });
  return dashboard;
};


export const deleteTransaction = async (dashboardId: string, txId: string) => {
  const dashboard = await DashboardModel.findById(dashboardId);
  if (!dashboard) return null;

  const tx = dashboard.transactions.id(txId);
  if (!tx) return null;

  try {
    // 🧾 Delete from Income or Expense collection if it exists
    if (tx.type === 'Income' && tx.refId) {
      await Income.findByIdAndDelete(tx.refId);
    } else if (tx.type === 'Expense' && tx.refId) {
      await Expense.findByIdAndDelete(tx.refId);
    }

    // 🗑 Remove transaction from dashboard
    await tx.deleteOne();
    await dashboard.save();

    // 🔁 Recalculate totals after deletion
    const incomes = await Income.find({ userId: dashboard.user });
    const expenses = await Expense.find({ userId: dashboard.user });

    dashboard.monthlyIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    dashboard.monthlyExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    dashboard.savingsRate =
      dashboard.monthlyIncome > 0
        ? ((dashboard.monthlyIncome - dashboard.monthlyExpenses) / dashboard.monthlyIncome) * 100
        : 0;

    await dashboard.save();

    return dashboard;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
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