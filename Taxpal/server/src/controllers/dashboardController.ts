import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';

export const getDashboardData = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    
    const currentMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

    // Get transactions for the period
    const transactions = await Transaction.find({
      userId,
      date: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1)
      }
    });

    // Calculate totals
    const monthlyIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Get previous month data for comparison
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const prevTransactions = await Transaction.find({
      userId,
      date: {
        $gte: new Date(prevYear, prevMonth - 1, 1),
        $lt: new Date(prevYear, prevMonth, 1)
      }
    });

    const prevIncome = prevTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevExpenses = prevTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate percentages
    const incomeChange = prevIncome > 0 ? ((monthlyIncome - prevIncome) / prevIncome) * 100 : 0;
    const expenseChange = prevExpenses > 0 ? ((monthlyExpenses - prevExpenses) / prevExpenses) * 100 : 0;

    // Get budgets
    const budgets = await Budget.find({
      userId,
      month: currentMonth,
      year: currentYear
    });

    // Expense breakdown by category
    const expenseBreakdown = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    res.json({
      monthlyIncome: {
        amount: monthlyIncome,
        change: incomeChange
      },
      monthlyExpenses: {
        amount: monthlyExpenses,
        change: expenseChange
      },
      estimatedTaxDues: monthlyIncome * 0.3, // Example tax calculation
      savingsRate: monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0,
      expenseBreakdown,
      budgets,
      recentTransactions: transactions.slice(0, 10).sort((a, b) => b.date.getTime() - a.date.getTime())
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

export const getIncomeVsExpenses = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { period = 'month' } = req.query;

    let groupBy: any = {};
    let dateFormat = '';

    switch (period) {
      case 'year':
        groupBy = { year: { $year: '$date' } };
        dateFormat = '%Y';
        break;
      case 'quarter':
        groupBy = { 
          year: { $year: '$date' },
          quarter: { $ceil: { $divide: [{ $month: '$date' }, 3] } }
        };
        dateFormat = 'Q%q %Y';
        break;
      default:
        groupBy = { 
          year: { $year: '$date' },
          month: { $month: '$date' }
        };
        dateFormat = '%Y-%m';
    }

    const data = await Transaction.aggregate([
      {
        $match: { userId: userId }
      },
      {
        $group: {
          _id: {
            ...groupBy,
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: '$_id.year',
          data: {
            $push: {
              period: '$_id',
              type: '$_id.type',
              total: '$total'
            }
          }
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch income vs expenses data' });
  }
};
