import { Budget, IBudget } from './budget.model';

export class BudgetService {
  async getBudgetsByUser(userId: string): Promise<IBudget[]> {
    return Budget.find({ userId });
  }

  async createBudget(data: Partial<IBudget>): Promise<IBudget> {
    const budget = new Budget(data);
    return budget.save();
  }

 async deleteBudget(_id: string): Promise<IBudget | null> {
  return Budget.findByIdAndDelete(_id.trim());
}


}
