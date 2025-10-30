import { Request, Response } from 'express';
import * as CategoryService from './category.service';

function isDuplicateError(err: any) {
  return err?.code === 11000 || /already exists/i.test(err?.message || '');
}

function sanitizeType(t: any): 'income' | 'expense' | undefined {
  return t === 'income' || t === 'expense' ? t : undefined;
}

// POST /api/categories
export const createCategory = async (req: Request, res: Response) => {
  try {
    const name = (req.body?.name ?? '').toString().trim();
    const type = sanitizeType(req.body?.type);

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    const category = await CategoryService.createCategory({ name, type });
    res.status(201).json(category);
  } catch (err: any) {
    if (isDuplicateError(err)) {
      return res.status(409).json({ message: 'Category with this name and type already exists' });
    }
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

    const data: any = {};
    if (typeof req.body?.name === 'string') data.name = req.body.name.trim();
    if (req.body?.type) data.type = sanitizeType(req.body.type);

    const category = await CategoryService.updateCategory(id, data);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err: any) {
    if (isDuplicateError(err)) {
      return res.status(409).json({ message: 'Category with this name and type already exists' });
    }
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
