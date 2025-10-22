import { Budget, IBudget } from './budget.model';
import { Types } from 'mongoose'; 

const calculateStatus = (amount: number, spent: number): 'Good' | 'Fair' | 'Poor' => {
    if (amount <= 0) {
        return 'Poor';
    }
    
    // Calculate percentage spent
    const percentageSpent = (spent / amount) * 100;
    
    // Status based on percentage spent
    if (percentageSpent >= 90) {
        return 'Poor';  // Over 90% spent
    } else if (percentageSpent >= 70) {
        return 'Fair';  // Between 70-90% spent
    } else {
        return 'Good';  // Less than 70% spent
    }
};



type IBudgetResponse = IBudget & { 
    _id: Types.ObjectId | string; 
    createdAt: Date; 
    updatedAt: Date;
    remaining: number; 
    status: 'Good' | 'Fair' | 'Poor'; 
};

export class BudgetService {
    public async getBudgetsByUser(userId: string): Promise<IBudgetResponse[]> {
        const budgets = await Budget.find({ userId: userId }).lean().exec();
        return budgets.map(budget => {
            const spent = budget.spent || 0;
            const remaining = budget.amount - spent;
            const status = calculateStatus(budget.amount, spent);
            
            return {
                ...budget,
                remaining,
                status
            } as IBudgetResponse;
        });
    }

    public async getBudgetById(budgetId: string): Promise<IBudgetResponse | null> {
        const budget = await Budget.findById(budgetId).lean().exec();
        if (!budget) return null;
        
        const spent = budget.spent || 0;
        const remaining = budget.amount - spent;
        const status = calculateStatus(budget.amount, spent);
        
        return {
            ...budget,
            remaining,
            status
        } as IBudgetResponse;
    }

    public async createBudget(data: {
        spent?: number;
        category: string;
        amount: number;
        month: string;
        description?: string;
        userId: string;
    }): Promise<IBudgetResponse> {
        // Ensure spent is a number >= 0
        const spent = Math.max(0, data.spent || 0);
        
        const newBudget = new Budget({
            ...data,
            spent: spent,
        });
        
        const savedDoc = await newBudget.save();
        const savedBudget = savedDoc.toObject();
        
        return {
            ...savedBudget,
            remaining: savedBudget.amount - spent,
            status: calculateStatus(savedBudget.amount, spent)
        } as IBudgetResponse;
    }

    public async updateBudgetSpent(budgetId: string, newSpent: number): Promise<IBudgetResponse | null> {
        const updatedBudget = await Budget.findByIdAndUpdate(
            budgetId,
            { spent: newSpent },
            { new: true, lean: true }
        );

        if (!updatedBudget) return null;
        
        const remaining = updatedBudget.amount - newSpent;
        const status = calculateStatus(updatedBudget.amount, newSpent);
        
        return {
            ...updatedBudget,
            remaining,
            status
        } as IBudgetResponse;
    }

    public async incrementBudgetSpent(budgetId: string, amount: number): Promise<IBudgetResponse | null> {
        const updatedBudget = await Budget.findByIdAndUpdate(
            budgetId,
            { $inc: { spent: amount } },
            { new: true, lean: true }
        );

        if (!updatedBudget) return null;
        
        const spent = updatedBudget.spent || 0;
        const remaining = updatedBudget.amount - spent;
        const status = calculateStatus(updatedBudget.amount, spent);
        
        return {
            ...updatedBudget,
            remaining,
            status
        } as IBudgetResponse;
    }

    public async updateBudget(budgetId: string, data: Partial<IBudget>): Promise<IBudgetResponse | null> {
        const updatedBudget = await Budget.findByIdAndUpdate(
            budgetId,
            data,
            { new: true, lean: true }
        );

        if (!updatedBudget) return null;
        
        const spent = updatedBudget.spent || 0;
        const remaining = updatedBudget.amount - spent;
        const status = calculateStatus(updatedBudget.amount, spent);
        
        return {
            ...updatedBudget,
            remaining,
            status
        } as IBudgetResponse;
    }

    public async deleteBudget(budgetId: string): Promise<IBudget | null> {
        return Budget.findByIdAndDelete(budgetId).exec();
    }
}