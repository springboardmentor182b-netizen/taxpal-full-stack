import TaxEstimate, { ITaxEstimate } from "./taxEstimator.model";
import * as reminderService from "../taxRemainders/taxReminder.service";
// Tax calculation logic
export const calculateEstimatedTax = (data: Partial<ITaxEstimate>): number => {
  const {
    gross_income_for_quarter = 0,
    business_expenses = 0,
    retirement_contribution = 0,
    health_insurance_premiums = 0,
    home_office_deduction = 0,
  } = data;

  const deductions =
    business_expenses +
    retirement_contribution +
    health_insurance_premiums +
    home_office_deduction;
  const taxableIncome = gross_income_for_quarter - deductions;
  // Example: flat 20% tax
  return taxableIncome > 0 ? taxableIncome * 0.2 : 0;
};
const getDueDateForQuarter = (quarter: string): Date => {
  const year = new Date().getFullYear();
  switch (quarter) {
    case "Q1 (Jan-Mar)":
      return new Date(year, 2, 31); // March 31
    case "Q2 (Apr-Jun)":
      return new Date(year, 5, 30); // June 30
    case "Q3 (Jul-Sep)":
      return new Date(year, 8, 30); // September 30
    case "Q4 (Oct-Dec)":
      return new Date(year, 11, 31); // December 31
    default:
      return new Date(); // fallback: today
  }
};

export const createEstimate = async (
  data: Partial<ITaxEstimate>
): Promise<ITaxEstimate> => {
  const estimated_tax = calculateEstimatedTax(data);
  const due_date = data.quarter ? getDueDateForQuarter(data.quarter) : undefined;

  const newEstimate = new TaxEstimate({ ...data, estimated_tax, due_date });
  const savedEstimate = await newEstimate.save();

  // ✅ Automatically generate reminders for the entire year
  if (data.user_id) {
    const year = new Date().getFullYear();
    await reminderService.generateQuarterlyReminders(
      data.user_id.toString(),
      estimated_tax , // assuming this quarter represents 1/4th of total
      year
    );
  }

  return savedEstimate;
};
export const getEstimates = async (): Promise<ITaxEstimate[]> => {
  return await TaxEstimate.find();
};
export const getEstimateById = async (
  id: string
): Promise<ITaxEstimate | null> => {
  return await TaxEstimate.findById(id);
};
