import { Expense } from './expense.model';

export const addExpense = async (userId: string, data: any) => {
  const expense = await Expense.create({ ...data, userId });
  return expense;
};
