const DashboardService = require('../src/apis/dashboard/dashboard.service');
const Transaction = require('../src/apis/incomeExpenseapi/TransactionModel');
const mongoose = require('mongoose');

jest.mock('../src/apis/incomeExpenseapi/TransactionModel', () => ({
  aggregate: jest.fn()
}));
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: jest.fn((id) => ({ toString: () => id, valueOf: () => id }))
  }
}));

describe('DashboardService', () => {
  let dashboardService;

  beforeEach(() => {
    dashboardService = new DashboardService();
    jest.clearAllMocks();
  });

  describe('getSummary', () => {
    it('should return correct summary with income and expenses', async () => {
      const userId = 'user123';

      Transaction.aggregate
        .mockResolvedValueOnce([{ total: 10000 }]) // income
        .mockResolvedValueOnce([{ total: 5000 }]); // expense

      const result = await dashboardService.getSummary(userId);

      expect(mongoose.Types.ObjectId).toHaveBeenCalledWith(userId);
      expect(Transaction.aggregate).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        totalIncome: 10000,
        totalExpenses: 5000,
        netBalance: 5000
      });
    });

    it('should handle zero income and expenses', async () => {
      const userId = 'user123';

      Transaction.aggregate
        .mockResolvedValueOnce([]) // no income
        .mockResolvedValueOnce([]); // no expense

      const result = await dashboardService.getSummary(userId);

      expect(result).toEqual({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0
      });
    });

    it('should handle only income', async () => {
      const userId = 'user123';

      Transaction.aggregate
        .mockResolvedValueOnce([{ total: 15000 }]) // income
        .mockResolvedValueOnce([]); // no expense

      const result = await dashboardService.getSummary(userId);

      expect(result).toEqual({
        totalIncome: 15000,
        totalExpenses: 0,
        netBalance: 15000
      });
    });
  });

  describe('getRecentTransactions', () => {
    it('should return recent transactions with default limit', async () => {
      const userId = 'user123';
      const mockTransactions = [
        { _id: '1', type: 'income', amount: 1000, category: 'Salary', date: new Date(), description: 'Monthly salary' },
        { _id: '2', type: 'expense', amount: 200, category: 'Food', date: new Date(), description: 'Lunch' }
      ];

      Transaction.aggregate.mockResolvedValue(mockTransactions);

      const result = await dashboardService.getRecentTransactions(userId);

      expect(mongoose.Types.ObjectId).toHaveBeenCalledWith(userId);
      expect(Transaction.aggregate).toHaveBeenCalledWith([
        { $match: { userId: expect.any(Object) } },
        { $sort: { date: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 1,
            type: 1,
            amount: 1,
            category: 1,
            date: 1,
            description: 1
          }
        }
      ]);
      expect(result).toEqual(mockTransactions);
    });

    it('should return recent transactions with custom limit', async () => {
      const userId = 'user123';
      const limit = 10;
      const mockTransactions = [];

      Transaction.aggregate.mockResolvedValue(mockTransactions);

      const result = await dashboardService.getRecentTransactions(userId, limit);

      expect(Transaction.aggregate).toHaveBeenCalledWith([
        { $match: { userId: expect.any(Object) } },
        { $sort: { date: -1 } },
        { $limit: 10 },
        expect.any(Object)
      ]);
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('getExpenseBreakdown', () => {
    it('should return expense breakdown by category', async () => {
      const userId = 'user123';
      const mockExpenses = [
        { _id: 'Office', total: 2000, count: 5 },
        { _id: 'Meals', total: 800, count: 10 }
      ];

      Transaction.aggregate.mockResolvedValue(mockExpenses);

      const result = await dashboardService.getExpenseBreakdown(userId);

      expect(mongoose.Types.ObjectId).toHaveBeenCalledWith(userId);
      expect(Transaction.aggregate).toHaveBeenCalledWith([
        { $match: { userId: expect.any(Object), type: 'expense' } },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { total: -1 } }
      ]);
      expect(result).toEqual(mockExpenses);
    });

    it('should return empty array when no expenses', async () => {
      const userId = 'user123';

      Transaction.aggregate.mockResolvedValue([]);

      const result = await dashboardService.getExpenseBreakdown(userId);

      expect(result).toEqual([]);
    });
  });

  describe('getBudgetProgress', () => {
    it('should return budget progress for current month', async () => {
      const userId = 'user123';
      const mockExpenses = [
        { _id: 'Office', spent: 1500 },
        { _id: 'Meals', spent: 400 }
      ];

      Transaction.aggregate.mockResolvedValue(mockExpenses);

      const result = await dashboardService.getBudgetProgress(userId);

      expect(mongoose.Types.ObjectId).toHaveBeenCalledWith(userId);
      expect(Transaction.aggregate).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          category: 'Office',
          spent: 1500,
          budget: 2000,
          percentage: 75
        },
        {
          category: 'Meals',
          spent: 400,
          budget: 600,
          percentage: (400 / 600) * 100
        }
      ]);
    });

    it('should handle categories not in budget with default 500', async () => {
      const userId = 'user123';
      const mockExpenses = [
        { _id: 'Unknown', spent: 300 }
      ];

      Transaction.aggregate.mockResolvedValue(mockExpenses);

      const result = await dashboardService.getBudgetProgress(userId);

      expect(result).toEqual([
        {
          category: 'Unknown',
          spent: 300,
          budget: 500,
          percentage: 60
        }
      ]);
    });

    it('should return empty array when no expenses', async () => {
      const userId = 'user123';

      Transaction.aggregate.mockResolvedValue([]);

      const result = await dashboardService.getBudgetProgress(userId);

      expect(result).toEqual([]);
    });
  });

  describe('getTaxEstimation', () => {
    it('should return tax estimation for current year', async () => {
      const userId = 'user123';
      const taxYear = 2023;
      const mockIncome = [{ total: 60000 }];

      Transaction.aggregate.mockResolvedValue(mockIncome);

      const result = await dashboardService.getTaxEstimation(userId, taxYear);

      expect(mongoose.Types.ObjectId).toHaveBeenCalledWith(userId);
      expect(Transaction.aggregate).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        year: taxYear,
        totalIncome: 60000,
        estimatedTax: 9000, // 60000 * 0.15
        quarterlyPayment: 2250, // 9000 / 4
        taxRate: 15
      });
    });

    it('should handle zero income', async () => {
      const userId = 'user123';
      const taxYear = 2023;

      Transaction.aggregate.mockResolvedValue([]);

      const result = await dashboardService.getTaxEstimation(userId, taxYear);

      expect(result).toEqual({
        year: taxYear,
        totalIncome: 0,
        estimatedTax: 0,
        quarterlyPayment: 0,
        taxRate: 15
      });
    });

    it('should use current year when not provided', async () => {
      const userId = 'user123';
      const currentYear = new Date().getFullYear();
      const mockIncome = [{ total: 50000 }];

      Transaction.aggregate.mockResolvedValue(mockIncome);

      const result = await dashboardService.getTaxEstimation(userId);

      expect(result.year).toBe(currentYear);
      expect(result.totalIncome).toBe(50000);
      expect(result.estimatedTax).toBe(7500);
      expect(result.quarterlyPayment).toBe(1875);
    });
  });
});
