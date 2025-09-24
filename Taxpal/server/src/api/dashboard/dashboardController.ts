import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthedRequest } from '../auth/auth';
import Transaction from '../dashboard/Transaction';
import Budget from '../dashboard/Budget';

const round2 = (n: number) => Math.round(n * 100) / 100;

const monthRange = (year: number, month1to12: number) => {
  const start = new Date(year, month1to12 - 1, 1);
  const end = new Date(year, month1to12, 1);
  return { start, end };
};

export const getDashboardData = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.user.id);
    const { month, year } = req.query;

    const currentMonth = month ? parseInt(month as string, 10) : new Date().getMonth() + 1;
    const currentYear  = year  ? parseInt(year  as string, 10) : new Date().getFullYear();

    const { start, end } = monthRange(currentYear, currentMonth);
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear  = currentMonth === 1 ? currentYear - 1 : currentYear;
    const { start: pStart, end: pEnd } = monthRange(prevYear, prevMonth);

    // --- Current month totals (income/expense) ---
    const curTotals = await Transaction.aggregate([
      { $match: { userId, date: { $gte: start, $lt: end } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    const monthlyIncome  = curTotals.find(r => r._id === 'income')?.total || 0;
    const monthlyExpenses = curTotals.find(r => r._id === 'expense')?.total || 0;

    // --- Previous month totals for % change ---
    const prevTotals = await Transaction.aggregate([
      { $match: { userId, date: { $gte: pStart, $lt: pEnd } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    const prevIncome  = prevTotals.find(r => r._id === 'income')?.total || 0;
    const prevExpenses = prevTotals.find(r => r._id === 'expense')?.total || 0;

    const incomeChange  = prevIncome  > 0 ? ((monthlyIncome  - prevIncome)  / prevIncome)  * 100 : 0;
    const expenseChange = prevExpenses > 0 ? ((monthlyExpenses - prevExpenses) / prevExpenses) * 100 : 0;

    // --- Expense breakdown by category (pie) ---
    const breakdown = await Transaction.aggregate([
      { $match: { userId, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', amount: { $sum: '$amount' } } },
      { $project: { _id: 0, category: '$_id', amount: 1 } },
      { $sort: { amount: -1 } }
    ]);

    // --- Budgets for this month with "spent" merged (single pipeline + map) ---
    const budgets = await Budget.find({ userId, month: currentMonth, year: currentYear }).lean();

    const spentByCategory = await Transaction.aggregate([
      { $match: { userId, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } }
    ]);
    const spentMap = new Map<string, number>(spentByCategory.map(x => [x._id as string, x.spent as number]));

    const budgetsOut = budgets.map(b => {
      const spent = spentMap.get(b.category) || 0;
      const remaining = Math.max(0, b.limit - spent);
      const usedPct = b.limit > 0 ? Math.min(100, (spent / b.limit) * 100) : 0;
      return { ...b, spent: round2(spent), remaining: round2(remaining), usedPct: round2(usedPct) };
    });

    // --- Recent transactions (top 10 by date desc) ---
    const recentTransactions = await Transaction.find({ userId, date: { $gte: start, $lt: end } })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    res.json({
      period: { year: currentYear, month: currentMonth, start, end },
      cards: {
        income:   { amount: round2(monthlyIncome),  changePct: round2(incomeChange) },
        expenses: { amount: round2(monthlyExpenses), changePct: round2(expenseChange) },
        estimatedTaxDues: round2(monthlyIncome * 0.30),
        savingsRatePct: monthlyIncome > 0 ? round2(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0
      },
      breakdown: {
        byCategory: breakdown
      },
      budgets: budgetsOut,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

export const getIncomeVsExpenses = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.user.id);
    const period = (req.query.period as string) || 'month'; // 'month' | 'quarter' | 'year'

    const addProjectionForPeriod =
      period === 'year'
        ? {
            y: { $year: '$date' }
          }
        : period === 'quarter'
        ? {
            y: { $year: '$date' },
            q: { $ceil: { $divide: [{ $month: '$date' }, 3] } }
          }
        : {
            y: { $year: '$date' },
            m: { $month: '$date' }
          };

    const grouped = await Transaction.aggregate([
      { $match: { userId } },
      { $project: { amount: 1, type: 1, date: 1, ...addProjectionForPeriod } },
      {
        $group: {
          _id:
            period === 'year'
              ? { y: '$y', type: '$type' }
              : period === 'quarter'
              ? { y: '$y', q: '$q', type: '$type' }
              : { y: '$y', m: '$m', type: '$type' },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Pivot -> labels + series arrays for Chart.js
    type Key = string;
    const keyOf = (d: any) =>
      period === 'year' ? `${d._id.y}` : period === 'quarter' ? `Q${d._id.q} ${d._id.y}` : `${d._id.y}-${String(d._id.m).padStart(2, '0')}`;

    const labelSet = new Set<Key>();
    const incomeMap = new Map<Key, number>();
    const expenseMap = new Map<Key, number>();

    for (const row of grouped) {
      const key = keyOf(row);
      labelSet.add(key);
      if (row._id.type === 'income') incomeMap.set(key, row.total);
      if (row._id.type === 'expense') expenseMap.set(key, row.total);
    }

    const labels = Array.from(labelSet);
    // sort labels chronologically
    labels.sort((a, b) => {
      if (period === 'year') return Number(a) - Number(b);
      if (period === 'quarter') {
        const [qa, ya] = a.split(' ');
        const [qb, yb] = b.split(' ');
        const na = Number(ya) * 10 + Number(qa.replace('Q', ''));
        const nb = Number(yb) * 10 + Number(qb.replace('Q', ''));
        return na - nb;
      }
      // YYYY-MM lexicographic works here
      return a.localeCompare(b);
    });

    const incomeSeries = labels.map(l => round2(incomeMap.get(l) || 0));
    const expenseSeries = labels.map(l => round2(expenseMap.get(l) || 0));

    res.json({
      labels,
      series: [
        { label: 'Income', data: incomeSeries },
        { label: 'Expenses', data: expenseSeries }
      ],
      period
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch income vs expenses data' });
  }
};
