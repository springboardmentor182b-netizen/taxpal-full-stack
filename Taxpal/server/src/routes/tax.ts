import express from 'express';
import TaxEstimate from '../models/TaxEstimate';
import Transaction from '../models/Transaction';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Tax calculation utilities
const calculateTax = (income: number, country: string): { rate: number; amount: number } => {
  // Simplified tax calculation - in production, this would be more complex
  let rate = 0;
  let amount = 0;

  switch (country.toLowerCase()) {
    case 'us':
      if (income <= 10275) {
        rate = 10;
      } else if (income <= 41775) {
        rate = 12;
      } else if (income <= 89450) {
        rate = 22;
      } else if (income <= 190750) {
        rate = 24;
      } else if (income <= 364200) {
        rate = 32;
      } else if (income <= 462550) {
        rate = 35;
      } else {
        rate = 37;
      }
      break;
    case 'ca':
      if (income <= 53359) {
        rate = 15;
      } else if (income <= 106717) {
        rate = 20.5;
      } else if (income <= 165430) {
        rate = 26;
      } else if (income <= 235675) {
        rate = 29;
      } else {
        rate = 33;
      }
      break;
    default:
      rate = 20; // Default rate
  }

  amount = (income * rate) / 100;
  return { rate, amount };
};

// Get tax estimates for user
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    const taxEstimates = await TaxEstimate.find({
      user_id: req.user._id,
      year: currentYear
    }).sort({ quarter: 1 });

    res.json(taxEstimates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tax estimates', error });
  }
});

// Calculate and create tax estimate
router.post('/calculate', authenticateToken, async (req: any, res) => {
  try {
    const { quarter, year } = req.body;
    const currentYear = year || new Date().getFullYear();
    const currentQuarter = quarter || getCurrentQuarter();

    // Calculate quarter date range
    const quarterDates = getQuarterDates(currentYear, currentQuarter);
    
    // Get income and expenses for the quarter
    const transactions = await Transaction.find({
      user_id: req.user._id,
      date: { $gte: quarterDates.start, $lte: quarterDates.end }
    });

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate deductions (simplified - in production, this would be more complex)
    const deductions = Math.min(expenses * 0.3, income * 0.2); // Simplified deduction calculation
    const taxableIncome = Math.max(0, income - deductions);

    // Calculate tax
    const taxCalculation = calculateTax(taxableIncome, req.user.country);
    
    // Calculate due date
    const dueDate = getQuarterDueDate(currentYear, currentQuarter);

    // Check if estimate already exists
    let taxEstimate = await TaxEstimate.findOne({
      user_id: req.user._id,
      quarter: currentQuarter,
      year: currentYear
    });

    if (taxEstimate) {
      // Update existing estimate
      taxEstimate.estimated_tax = taxCalculation.amount;
      taxEstimate.income_total = income;
      taxEstimate.deductions_total = deductions;
      taxEstimate.tax_rate = taxCalculation.rate;
      taxEstimate.due_date = dueDate;
      await taxEstimate.save();
    } else {
      // Create new estimate
      taxEstimate = new TaxEstimate({
        user_id: req.user._id,
        quarter: currentQuarter,
        year: currentYear,
        estimated_tax: taxCalculation.amount,
        income_total: income,
        deductions_total: deductions,
        tax_rate: taxCalculation.rate,
        due_date: dueDate
      });
      await taxEstimate.save();
    }

    res.json({
      message: 'Tax estimate calculated successfully',
      taxEstimate,
      calculation: {
        income,
        expenses,
        deductions,
        taxableIncome,
        taxRate: taxCalculation.rate,
        estimatedTax: taxCalculation.amount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating tax estimate', error });
  }
});

// Get tax calendar (upcoming due dates)
router.get('/calendar', authenticateToken, async (req: any, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    const calendar = await Promise.all(
      quarters.map(async (quarter) => {
        const dueDate = getQuarterDueDate(currentYear, quarter);
        const estimate = await TaxEstimate.findOne({
          user_id: req.user._id,
          quarter,
          year: currentYear
        });

        return {
          quarter,
          dueDate,
          estimatedTax: estimate?.estimated_tax || 0,
          status: estimate?.status || 'pending',
          isOverdue: new Date() > dueDate && estimate?.status !== 'paid'
        };
      })
    );

    res.json(calendar);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tax calendar', error });
  }
});

// Helper functions
function getCurrentQuarter(): string {
  const month = new Date().getMonth() + 1;
  if (month <= 3) return 'Q1';
  if (month <= 6) return 'Q2';
  if (month <= 9) return 'Q3';
  return 'Q4';
}

function getQuarterDates(year: number, quarter: string): { start: Date; end: Date } {
  const quarterMap = {
    'Q1': { start: 1, end: 3 },
    'Q2': { start: 4, end: 6 },
    'Q3': { start: 7, end: 9 },
    'Q4': { start: 10, end: 12 }
  };

  const { start: startMonth, end: endMonth } = quarterMap[quarter as keyof typeof quarterMap];
  
  return {
    start: new Date(year, startMonth - 1, 1),
    end: new Date(year, endMonth, 0)
  };
}

function getQuarterDueDate(year: number, quarter: string): Date {
  const dueDateMap = {
    'Q1': new Date(year, 3, 15), // April 15
    'Q2': new Date(year, 5, 15), // June 15
    'Q3': new Date(year, 8, 15), // September 15
    'Q4': new Date(year + 1, 0, 15) // January 15 of next year
  };

  return dueDateMap[quarter as keyof typeof dueDateMap];
}

export default router;
