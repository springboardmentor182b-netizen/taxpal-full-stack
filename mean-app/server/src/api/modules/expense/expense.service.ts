import { Expense, IExpense } from './expense.model';
import { BudgetService } from '../budget/budget.service';
import mongoose, { Types } from 'mongoose';

const budgetService = new BudgetService();

type CreateExpenseData = {
  amount: number;
  category: string;
  description: string;
  budgetId?: string;
  date?: Date;
  notes?: string;
};

type UpdateExpenseData = Partial<{
  amount: number;
  category: string;
  description: string;
  budgetId: string;
  date: Date;
  notes: string;
}>;

export class ExpenseService {
  public async addExpense(userId: string, data: CreateExpenseData): Promise<IExpense> {
    const expense = await Expense.create({ 
      ...data,
      userId: new Types.ObjectId(userId),
      budgetId: data.budgetId ? new Types.ObjectId(data.budgetId) : undefined,
      date: data.date || new Date()
    });

    // Update the associated budget's spent amount
    if (data.budgetId) {
      await budgetService.incrementBudgetSpent(data.budgetId, data.amount);
    }

    return expense;
  }

  public async updateExpense(expenseId: string, data: UpdateExpenseData): Promise<IExpense | null> {
    // First get the current expense to calculate spent difference
    const currentExpense = await Expense.findById(expenseId);
    if (!currentExpense) return null;

    const updateData = {
      ...data,
      budgetId: data.budgetId ? new Types.ObjectId(data.budgetId) : undefined
    };

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      updateData,
      { new: true }
    );

    if (!updatedExpense) return null;

    // If amount changed and we have a budgetId, update the budget's spent amount
    if (data.amount !== undefined && 
        currentExpense.budgetId &&
        data.amount !== currentExpense.amount) {
      const amountDiff = data.amount - currentExpense.amount;
      await budgetService.incrementBudgetSpent(
        currentExpense.budgetId.toString(),
        amountDiff
      );
    }

    // If budgetId changed, update both old and new budgets
    if (data.budgetId !== undefined && 
        data.budgetId !== currentExpense.budgetId?.toString()) {
      
      // Remove amount from old budget if it exists
      if (currentExpense.budgetId) {
        await budgetService.incrementBudgetSpent(
          currentExpense.budgetId.toString(),
          -currentExpense.amount
        );
      }

      // Add amount to new budget
      if (data.budgetId) {
        await budgetService.incrementBudgetSpent(
          data.budgetId,
          updatedExpense.amount
        );
      }
    }

    return updatedExpense;
  }

  public async deleteExpense(expenseId: string): Promise<IExpense | null> {
    const expense = await Expense.findById(expenseId);
    if (!expense) return null;

    // Remove the expense amount from the budget's spent amount
    if (expense.budgetId) {
      await budgetService.incrementBudgetSpent(
        expense.budgetId.toString(),
        -expense.amount
      );
    }

    return Expense.findByIdAndDelete(expenseId);
  }

  public async getExpensesByUser(userId: string): Promise<IExpense[]> {
    return Expense.find({ userId }).sort({ date: -1 }).exec();
  }

  public async getExpenseById(expenseId: string): Promise<IExpense | null> {
    return Expense.findById(expenseId).exec();
  }
}
