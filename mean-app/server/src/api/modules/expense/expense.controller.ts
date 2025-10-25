// expense.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { addExpense } from "./expense.service";

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    //const userId="68cbdd76325a0b6ac813c763";
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const expense = await addExpense(userId, req.body);
    res.status(201).json({ message: "Expense recorded successfully", expense });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
