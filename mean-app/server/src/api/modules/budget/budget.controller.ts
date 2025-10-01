import { Request, Response } from 'express';
import { BudgetService } from './budget.service';

const budgetService = new BudgetService();

export class BudgetController {
  // Get all budgets of a user
  async getBudgets(req: Request, res: Response) {
    try {
      const userId = req.params.id; // userId from URL
      if (!userId) return res.status(400).json({ message: 'Missing userId' });

      const budgets = await budgetService.getBudgetsByUser(userId);
      res.json(budgets);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  // Create a new budget
  async createBudget(req: Request, res: Response) {
    try {
      const { category, amount, month, description, userId } = req.body;

      if (!category || !amount || !month || !userId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newBudget = await budgetService.createBudget({
        category,
        amount,
        month,
        description,
        userId,
      });

      res.status(201).json(newBudget);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

 async deleteBudget(req: Request, res: Response) {
  try {
    const budgetId = req.params.id?.trim(); // Use 'id' and trim whitespace
    if (!budgetId) return res.status(400).json({ message: 'Missing budgetId' });

    const deleted = await budgetService.deleteBudget(budgetId);
    if (!deleted) return res.status(404).json({ message: 'Budget not found' });

    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
}