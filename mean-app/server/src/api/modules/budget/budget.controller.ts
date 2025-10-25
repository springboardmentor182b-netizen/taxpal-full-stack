import { Request, Response } from 'express';
// Note the service import is now correct (assuming the file path is correct)
import { BudgetService } from './budget.service'; 

// Define a type for the injected service to remove the need for IBudgetService
type BudgetServiceType = Pick<BudgetService, 'getBudgetsByUser' | 'createBudget' | 'deleteBudget'>;

export class BudgetController {
    // Inject the service dependency
    constructor(private budgetService: BudgetServiceType) {} 

    public async getBudgets(req: Request, res: Response): Promise<void> {
        try {
            // 💡 In a real app, userId should come from an auth token (req.user.id)
            // Using params.id as per your routing setup: /api/v1/budgets/:id
            const userId = req.params.id;
            if (!userId) {
                res.status(400).json({ message: 'Missing userId in route parameter' });
                return;
            }

            const budgets = await this.budgetService.getBudgetsByUser(userId);
            res.json(budgets);
        } catch (err) {
            console.error('Error fetching budgets:', err); 
            res.status(500).json({ error: (err as Error).message });
        }
    }

    public async createBudget(req: Request, res: Response): Promise<void> {
        try {
            // Note: userId is expected in the body here, but should come from the auth token for security
            const { category, amount, month, description,spent, userId } = req.body; 

            if (!category || !amount || !month || !userId) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }

            const newBudget = await this.budgetService.createBudget({
                category,
                amount: Number(amount), 
                month,
                description,
                spent,
                userId,
            });

            res.status(201).json(newBudget);
        } catch (err) {
            console.error('Error creating budget:', err); 
            res.status(500).json({ error: (err as Error).message });
        }
    }

    public async deleteBudget(req: Request, res: Response): Promise<void> {
        try {
            const budgetId = req.params.id?.trim();
            if (!budgetId) {
                res.status(400).json({ message: 'Missing budgetId' });
                return;
            }

            const deleted = await this.budgetService.deleteBudget(budgetId);

            if (!deleted) {
                res.status(404).json({ message: 'Budget not found' });
                return;
            }

            res.json({ message: 'Budget deleted successfully' });
        } catch (err) {
            console.error('Error deleting budget:', err);
            res.status(500).json({ error: (err as Error).message });
        }
    }
}