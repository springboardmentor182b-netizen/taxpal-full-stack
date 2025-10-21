import { TaxInput, TaxOutput, TaxCalendarInput } from "./TaxEstimator.types";
import { TaxEstimatorModel, TaxCalendarModel } from "./TaxEstimator.model";

export class TaxEstimatorService {
  // ----- Tax Estimation Logic -----
  static async calculateTax(data: TaxInput): Promise<TaxOutput> {
    const { income, deductions = 0 } = data;

    const taxableIncome = income - deductions;
    let taxAmount = 0;

    // Basic India-like tax slab logic
    if (taxableIncome <= 250000) taxAmount = 0;
    else if (taxableIncome <= 500000)
      taxAmount = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000)
      taxAmount = 12500 + (taxableIncome - 500000) * 0.2;
    else taxAmount = 112500 + (taxableIncome - 1000000) * 0.3;

    const effectiveTaxRate = (taxAmount / income) * 100;

    // Save record
    await TaxEstimatorModel.create({
      income,
      deductions,
      taxAmount,
      taxYear: data.taxYear || new Date().getFullYear(),
    });

    return { taxableIncome, taxAmount, effectiveTaxRate };
  }

  static async getAllTaxRecords() {
    return TaxEstimatorModel.find().sort({ createdAt: -1 });
  }

  // ----- Tax Calendar Logic -----
  static async addCalendarEvent(event: TaxCalendarInput) {
    return TaxCalendarModel.create(event);
  }

  static async getAllCalendarEvents() {
    return TaxCalendarModel.find().sort({ dueDate: 1 });
  }

  static async deleteCalendarEvent(id: string) {
    return TaxCalendarModel.findByIdAndDelete(id);
  }

  // ✅ NEW: bulk delete reminders (title begins with "Reminder")
  static async deleteAllReminders() {
    // Using a title convention we already rely on in the UI
    const res = await TaxCalendarModel.deleteMany({ title: { $regex: /^Reminder/i } });
    return res.deletedCount ?? 0;
  }
}
