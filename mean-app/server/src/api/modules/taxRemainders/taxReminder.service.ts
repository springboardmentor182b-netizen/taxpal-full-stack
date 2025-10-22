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
    const quarters = [
        { quarter: "Q1 (Apr-Jun)", due_date: new Date(startYear, 5, 15) },
        { quarter: "Q2 (Jul-Sep)", due_date: new Date(startYear, 8, 15) },
        { quarter: "Q3 (Oct-Dec)", due_date: new Date(startYear, 11, 15) },
        { quarter: "Q4 (Jan-Mar)", due_date: new Date(startYear + 1, 2, 15) },
      ];
      

  const amountPerQuarter = totalTax / 4;

  const reminders = quarters.map((q) => ({
    user_id,
    quarter: q.quarter,
    due_date: q.due_date,
    amount: amountPerQuarter,
    status: "reminder",
  }));

  // Remove old reminders for this user before creating new ones
  await TaxReminder.deleteMany({ user_id });

  return await TaxReminder.insertMany(reminders);
};
