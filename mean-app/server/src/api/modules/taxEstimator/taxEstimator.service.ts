import TaxEstimate, { ITaxEstimate } from "./taxEstimator.model";

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
export const createEstimate = async (
  data: Partial<ITaxEstimate>
): Promise<ITaxEstimate> => {
  const estimated_tax = calculateEstimatedTax(data);
  const newEstimate = new TaxEstimate({ ...data, estimated_tax });
  return await newEstimate.save();
};

export const getEstimates = async (): Promise<ITaxEstimate[]> => {
  return await TaxEstimate.find();
};

export const getEstimateById = async (
  id: string
): Promise<ITaxEstimate | null> => {
  return await TaxEstimate.findById(id);
};
