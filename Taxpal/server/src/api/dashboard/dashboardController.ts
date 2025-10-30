import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthedRequest } from '../auth/auth';
import Transaction from '../transaction/Transaction.model';
import Budget from '../budget/budget.model';

// ---------------- helpers ----------------
const round2 = (n: number) => Math.round(n * 100) / 100;
const pad2 = (n: number) => String(n).padStart(2, '0');

const monthRange = (year: number, month1to12: number) => {
  const start = new Date(year, month1to12 - 1, 1);
  const end = new Date(year, month1to12, 1); // exclusive
  return { start, end };
};

const quarterRange = (year: number, q1to4: number) => {
  const startMonth = (q1to4 - 1) * 3;
  const start = new Date(year, startMonth, 1);
  const end = new Date(year, startMonth + 3, 1); // exclusive
  return { start, end };
};

const yearRange = (year: number) => {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1); // exclusive
  return { start, end };
};

// ---------------- handlers ----------------
export const getDashboardData = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const userId = new Types.ObjectId(req.user.id);
    const { month, year } = req.query;

    const currentMonth = month ? parseInt(month as string, 10) : new Date().getMonth() + 1;
    const currentYear  = year  ? parseInt(year  as string, 10) : new Date().getFullYear();
    const monthStr = `${currentYear}-${pad2(currentMonth)}`;

    const { start, end } = monthRange(currentYear, currentMonth);
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear  = currentMonth === 1 ? currentYear - 1 : currentYear;
    const { start: pStart, end: pEnd } = monthRange(prevYear, prevMonth);

    // --- Current month totals ---
    const curTotals = await Transaction.aggregate([
      { $match: { userId, date: { $gte: start, $lt: end } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);
    const monthlyIncome   = curTotals.find(r => r._id === 'income')?.total || 0;
    const monthlyExpenses = curTotals.find(r => r._id === 'expense')?.total || 0;

    // --- Previous month totals for % change ---
    const prevTotals = await Transaction.aggregate([
      { $match: { userId, date: { $gte: pStart, $lt: pEnd } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);
    const prevIncome   = prevTotals.find(r => r._id === 'income')?.total || 0;
    const prevExpenses = prevTotals.find(r => r._id === 'expense')?.total || 0;

    const incomeChange  = prevIncome   > 0 ? ((monthlyIncome   - prevIncome)   / prevIncome)   * 100 : 0;
    const expenseChange = prevExpenses > 0 ? ((monthlyExpenses - prevExpenses) / prevExpenses) * 100 : 0;

    // --- Expense breakdown (pie) for current month ---
    const breakdown = await Transaction.aggregate([
      { $match: { userId, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', amount: { $sum: '$amount' } } },
      { $project: { _id: 0, category: '$_id', amount: 1 } },
      { $sort: { amount: -1 } }
    ]);

    // --- Budgets (spent/remaining/usedPct) ---
    const budgets = await Budget.find({ userId, month: monthStr }).lean();
    const spentByCategory = await Transaction.aggregate([
      { $match: { userId, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } }
    ]);
    const spentMap = new Map<string, number>(spentByCategory.map(x => [x._id as string, x.spent as number]));

    const budgetsOut = budgets.map(b => {
      const spent = spentMap.get(b.category) || 0;
      const cap = Number(b.amount) || 0;
      const remaining = Math.max(0, cap - spent);
      const usedPct = cap > 0 ? Math.min(100, (spent / cap) * 100) : 0;
      return {
        _id: String((b as any)._id),
        userId: (b as any).userId ? String((b as any).userId) : undefined,
        category: b.category,
        amount: round2(cap),
        month: b.month,
        monthStart: b.monthStart,
        description: b.description ?? '',
        spent: round2(spent),
        remaining: round2(remaining),
        usedPct: round2(usedPct),
        createdAt: (b as any).createdAt,
        updatedAt: (b as any).updatedAt
      };
    });

    // --- Recent transactions (top 10 by date desc) ---
    const recentTransactions = await Transaction.find({ userId, date: { $gte: start, $lt: end } })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    res.json({
      period: { year: currentYear, month: currentMonth, monthStr, start, end },
      cards: {
        income:   { amount: round2(monthlyIncome),   changePct: round2(incomeChange) },
        expenses: { amount: round2(monthlyExpenses), changePct: round2(expenseChange) },
        estimatedTaxDues: round2(monthlyIncome * 0.30), // placeholder
        savingsRatePct: monthlyIncome > 0 ? round2(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0
      },
      breakdown: { byCategory: breakdown },
      budgets: budgetsOut,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

/**
 * GET /api/v1/dashboard/income-vs-expenses
 */
export const getIncomeVsExpenses = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const userId = new Types.ObjectId(req.user.id);

    const qPeriod = (req.query.period as string) || (req.query.range as string) || 'month';
    const period: 'month' | 'quarter' | 'year' =
      qPeriod === 'quarter' ? 'quarter' : qPeriod === 'year' ? 'year' : 'month';

    const now = new Date();
    const qMonth = req.query.month ? parseInt(req.query.month as string, 10) : (now.getMonth() + 1);
    const qYear  = req.query.year  ? parseInt(req.query.year  as string, 10) : now.getFullYear();

    let start: Date, end: Date;
    let labels: string[] = [];

    if (period === 'month') {
      ({ start, end } = monthRange(qYear, qMonth));
      const rows = await Transaction.aggregate([
        { $match: { userId, date: { $gte: start, $lt: end } } },
        {
          $project: {
            amount: 1,
            type: 1,
            dayKey: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
          }
        },
        { $group: { _id: { dayKey: '$dayKey', type: '$type' }, total: { $sum: '$amount' } } }
      ]);

      const incomeMap = new Map<string, number>();
      const expenseMap = new Map<string, number>();
      for (const r of rows) {
        const k = r._id.dayKey as string;
        if (r._id.type === 'income') incomeMap.set(k, r.total);
        if (r._id.type === 'expense') expenseMap.set(k, r.total);
      }

      const incomeSeries: number[] = [];
      const expenseSeries: number[] = [];
      const cur = new Date(start);

      while (cur < end) {
        const key = cur.toISOString().slice(0, 10); // YYYY-MM-DD
        labels.push(cur.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }));
        incomeSeries.push(round2(incomeMap.get(key) || 0));
        expenseSeries.push(round2(expenseMap.get(key) || 0));
        cur.setDate(cur.getDate() + 1);
      }

      res.json({
        labels,
        series: [
          { label: 'Income', data: incomeSeries },
          { label: 'Expenses', data: expenseSeries }
        ],
        period
      });
      return;
    }

    if (period === 'quarter') {
      const q = Math.ceil(qMonth / 3);
      const qr = quarterRange(qYear, q);
      start = qr.start; end = qr.end;
    } else {
      const yr = yearRange(qYear);
      start = yr.start; end = yr.end;
    }

    const rows = await Transaction.aggregate([
      { $match: { userId, date: { $gte: start, $lt: end } } },
      {
        $project: {
          amount: 1,
          type: 1,
          ym: { $dateToString: { format: '%Y-%m', date: '$date' } }
        }
      },
      { $group: { _id: { ym: '$ym', type: '$type' }, total: { $sum: '$amount' } } }
    ]);

    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();
    for (const r of rows) {
      const k = r._id.ym as string;
      if (r._id.type === 'income') incomeMap.set(k, r.total);
      if (r._id.type === 'expense') expenseMap.set(k, r.total);
    }

    const incomeSeries: number[] = [];
    const expenseSeries: number[] = [];
    const cur = new Date(start);

    while (cur < end) {
      const y = cur.getFullYear();
      const m = cur.getMonth() + 1;
      const ym = `${y}-${pad2(m)}`;

      labels.push(new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }));
      incomeSeries.push(round2(incomeMap.get(ym) || 0));
      expenseSeries.push(round2(expenseMap.get(ym) || 0));

      cur.setMonth(cur.getMonth() + 1);
    }

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

// ---------------- Recent transactions endpoint ----------------
export const getRecentTransactions = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const userId = new Types.ObjectId(req.user.id);

    const limitRaw = Number(req.query.limit ?? 8);
    const limit = Math.max(1, Math.min(isFinite(limitRaw) ? limitRaw : 8, 100));

    const { startDate, endDate } = req.query as any;
    const q: any = { userId };

    if (startDate || endDate) {
      q.date = {};
      if (startDate) q.date.$gte = new Date(String(startDate));
      if (endDate)   q.date.$lte = new Date(String(endDate));
    }

    const docs = await Transaction.find(q)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    const transactions = docs.map(d => ({
      _id: String(d._id),
      user_id: String(d.userId),
      type: d.type as 'income' | 'expense',
      category: (d as any).category ?? 'General',
      amount: Number((d as any).amount),
      date: d.date,
      description:
        (d as any).description ?? (d as any).source ?? (d.type === 'income' ? 'Income' : 'Expense'),
      createdAt: (d as any).createdAt,
      updatedAt: (d as any).updatedAt,
    }));

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent transactions' });
  }
};
