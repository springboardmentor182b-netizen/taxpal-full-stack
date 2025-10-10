import { Request, Response } from 'express';
import * as CategoryService from './category.service';

// POST /api/categories
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }
    const category = await CategoryService.createCategory({ name, type });
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/categories
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Category id is required' });
    const category = await CategoryService.updateCategory(id, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Category id is required' });
    const category = await CategoryService.deleteCategory(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
