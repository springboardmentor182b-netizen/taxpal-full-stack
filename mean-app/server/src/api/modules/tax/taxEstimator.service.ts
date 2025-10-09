import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calculates the total income for a user within the current financial year.
 * @param userId - The ID of the user.
 * @returns The total income.
 */
async function getTotalIncome(userId: string): Promise<number> {
  // Determine the start and end of the current financial year (April 1 to March 31)
  const now = new Date();
  const currentMonth = now.getMonth(); // 0 = January, 11 = December
  const currentYear = now.getFullYear();

  let financialYearStart: Date;
  let financialYearEnd: Date;

  if (currentMonth >= 3) { // April or later
    financialYearStart = new Date(currentYear, 3, 1); // April 1 of current year
    financialYearEnd = new Date(currentYear + 1, 2, 31); // March 31 of next year
  } else { // January, February, or March
    financialYearStart = new Date(currentYear - 1, 3, 1); // April 1 of previous year
    financialYearEnd = new Date(currentYear, 2, 31); // March 31 of current year
  }

  const incomeTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: 'income',
      date: {
        gte: financialYearStart,
        lte: financialYearEnd,
      },
    },
  });

  const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  return totalIncome;
}


/**
 * Estimates the income tax for a user based on their total income.
 * This calculation uses the default New Tax Regime for FY 2024-25 (AY 2025-26).
 * @param userId - The ID of the user.
 * @returns An object containing the tax calculation details.
 */
export async function estimateTax(userId: string) {
  const totalAnnualIncome = await getTotalIncome(userId);

  // A standard deduction of ₹50,000 is available under the new regime.
  const standardDeduction = 50000;
  const taxableIncome = Math.max(0, totalAnnualIncome - standardDeduction);

  let incomeTax = 0;

  // New Tax Regime Slabs (FY 2024-25)
  if (taxableIncome > 1500000) {
    incomeTax = 150000 + (taxableIncome - 1500000) * 0.30;
  } else if (taxableIncome > 1200000) {
    incomeTax = 90000 + (taxableIncome - 1200000) * 0.20;
  } else if (taxableIncome > 900000) {
    incomeTax = 45000 + (taxableIncome - 900000) * 0.15;
  } else if (taxableIncome > 600000) {
    incomeTax = 15000 + (taxableIncome - 600000) * 0.10;
  } else if (taxableIncome > 300000) {
    incomeTax = (taxableIncome - 300000) * 0.05;
  }
  
  // Health and Education Cess is 4% of the income tax.
  const cess = incomeTax * 0.04;
  const totalTaxPayable = incomeTax + cess;

  return {
    totalAnnualIncome,
    standardDeduction,
    taxableIncome,
    incomeTax: parseFloat(incomeTax.toFixed(2)),
    cess: parseFloat(cess.toFixed(2)),
    totalTaxPayable: parseFloat(totalTaxPayable.toFixed(2)),
    taxRegime: 'New Regime (FY 2024-25)',
  };
}
