import TaxReminder, { ITaxReminder } from "./taxReminder.model"; 
export const createReminder = async (data: Partial<ITaxReminder>) => {
  const reminder = new TaxReminder(data);
  return await reminder.save();
};

export const getRemindersByUser = async (user_id: string) => {
  return await TaxReminder.find({ user_id }).sort({ due_date: 1 });
};

export const updateReminderStatus = async (
  id: string,
  status: "reminder" | "payment_done"
) => {
  return await TaxReminder.findByIdAndUpdate(id, { status }, { new: true });
};

// 🔹 Generate reminders for all 4 quarters dynamically
export const generateQuarterlyReminders = async (
  user_id: string,
  totalTax: number,
  startYear: number
) => {
    // Define quarters with due dates. Use month indices (0-based) for Date.
    const quarters = [
      { quarter: "Q1 (Jan-Mar)", due_date: new Date(startYear, 2, 31) },
      { quarter: "Q2 (Apr-Jun)", due_date: new Date(startYear, 5, 30) },
      { quarter: "Q3 (Jul-Sep)", due_date: new Date(startYear, 8, 30) },
      { quarter: "Q4 (Oct-Dec)", due_date: new Date(startYear, 11, 31) },
    ];
      

  const amountPerQuarter = totalTax / 4;

  const reminders = quarters.map((q) => ({
    user_id,
    quarter: q.quarter,
    due_date: q.due_date,
    amount: amountPerQuarter,
    status: "reminder",
  }));

  // Remove old reminders for this user and the same year before creating new ones
  // We check reminders whose due_date falls within the startYear..startYear range
  const startOfYear = new Date(startYear, 0, 1);
  const endOfYear = new Date(startYear, 11, 31, 23, 59, 59);
  await TaxReminder.deleteMany({
    user_id,
    due_date: { $gte: startOfYear, $lte: endOfYear },
  });

  return await TaxReminder.insertMany(reminders);
};