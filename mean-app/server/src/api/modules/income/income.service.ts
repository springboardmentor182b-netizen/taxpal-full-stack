import { Income } from './income.model';

export const addIncome = async (data: any, userId: string) => {
  const income = await Income.create({ ...data, userId });
  return {
    message: 'Income recorded successfully',
    income
  };
};
