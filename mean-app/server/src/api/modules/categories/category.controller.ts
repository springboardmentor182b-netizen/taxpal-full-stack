import { Response } from "express";
import * as categoryService from "./category.service";
import { AuthRequest } from "../../middlewares/auth";

const defaultCategories = [
  { name: "Business Expenses", type: "expense" },
  { name: "Office Rent", type: "expense" },
  { name: "Travel", type: "expense" },
  { name: "Salary", type: "income" },
  { name: "Investments", type: "income" }
];
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const category = await categoryService.createCategory(req.body, req.user.id);
    res.status(201).json({ success: true, data: category });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const userCategories = await categoryService.getUserCategories(req.user.id);
    res.json({ success: true, data: [...defaultCategories, ...userCategories] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const category = await categoryService.updateCategory(req.params.id, req.body, req.user.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, data: category });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const category = await categoryService.deleteCategory(req.params.id, req.user.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
