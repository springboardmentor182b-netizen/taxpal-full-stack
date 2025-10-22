import { Budget, IBudget } from './budget.model';
import { Types } from 'mongoose'; 

const calculateStatus = (amount: number, spent: number): 'Good' | 'Fair' | 'Poor' => {
   
    // NOTE: Status logic is based ONLY on the total budget amount, as per the current implementation criteria.
    
    if (amount <= 0) {
        return 'Poor';
    }
    
    // Budget less than $100 -> Poor
    if (amount < 100) {
        return 'Poor';
    }
    
    // Budget between $100 and $500 (inclusive) -> Fair
    if (amount <= 500) {
        return 'Fair';
    }
    
    // Budget above $500 -> Good
    return 'Good';
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
            // Logic for fetched budgets: Ensures remaining is calculated correctly
            const remaining = budget.amount - budget.spent;
            const status = calculateStatus(budget.amount, budget.spent);
            
            return {
                ...budget, // Includes _id, createdAt, etc. from .lean()
                remaining: remaining,
                status: status
            } as IBudgetResponse;
        });
    }

    // POST (Create) Operations
    public async createBudget(data: {
        spent: number; category: string, amount: number, month: string, description?: string, userId: string 
}): Promise<IBudgetResponse> {
        const newBudget = new Budget({
            ...data,
            spent: data.spent ?? 0,
        });
        
        // Save the document
        const savedDoc = await newBudget.save();

        // Get the plain object representation to return
        const savedBudget = savedDoc.toObject();

        // FIX: Calculate final response fields correctly: remaining = amount - spent
        const remaining = savedBudget.amount - savedBudget.spent;
        const status = calculateStatus(savedBudget.amount, savedBudget.spent); 
        
        return {
            ...savedBudget, // Includes _id, createdAt, etc.
            remaining: remaining,
            status: status
        } as IBudgetResponse;
    }

    // DELETE Operations
    public async deleteBudget(budgetId: string): Promise<IBudget | null> {
        // This method is fine, it returns the deleted document or null.
        return Budget.findByIdAndDelete(budgetId).exec();
    }
}
