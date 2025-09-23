import { Request, Response } from "express";
import { Budget } from "../models/budget.model";

// Create Budget
export const createBudget = async (req: Request, res: Response) => {
  try {
    const { category, month, amount, description } = req.body;

    if (!category || !month || !amount) {
      return res.status(400).json({ message: "Category, month, and amount are required" });
    }

    const budget = await Budget.create({
      category,
      user: (req as any).user.id, // user added by auth middleware
      month,
      amount,
      description
    });

    res.status(201).json(budget);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get all Budgets
export const getBudgets = async (req: Request, res: Response) => {
  try {
    const budgets = await Budget.find({ user: (req as any).user.id })
      .populate("category", "name type");

    res.status(200).json(budgets);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update Budget
export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOneAndUpdate(
      { _id: id, user: (req as any).user.id },
      req.body,
      { new: true }
    );

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    res.json(budget);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Budget
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOneAndDelete({ _id: id, user: (req as any).user.id });

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    res.json({ message: "Budget deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
