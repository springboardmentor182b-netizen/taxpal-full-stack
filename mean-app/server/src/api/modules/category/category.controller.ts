import { Request, Response } from 'express';
import * as categoryService from './category.service.js';
import { CategoryCreateUpdatePayload } from './category.model.js';
import { Prisma } from '@prisma/client';

// Custom Request type extension to include userId added by authMiddleware
interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Validates the request body for create/update operations.
 * @param body The request body object.
 * @returns True if the body is a valid CategoryCreateUpdatePayload structure.
 */
function validateCategoryPayload(body: any): body is CategoryCreateUpdatePayload {
  const { name, type } = body;
  // Ensure name is a non-empty string and type is strictly 'Income' or 'Expense'
  return typeof name === 'string' && name.trim().length > 0 &&
         (type === 'Income' || type === 'Expense');
}

/**
 * GET /api/category
 * Fetches all categories for the authenticated user.
 */
export async function getCategories(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId;

  if (!userId) {
    // This should theoretically not happen if authMiddleware runs correctly, but is a safe guard
    res.status(401).json({ success: false, message: 'User not authenticated.' });
    return;
  }

  try {
    const categories = await categoryService.getCategoriesByUserId(userId);
    // Prisma returns Date objects, Express/JSON serializer handles conversion
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories due to a server error.' });
  }
}

/**
 * POST /api/category
 * Creates a new category.
 */
export async function createCategory(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId;
  const payload: CategoryCreateUpdatePayload = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: 'User not authenticated.' });
    return;
  }

  if (!validateCategoryPayload(payload)) {
    res.status(400).json({ success: false, message: 'Invalid payload: name (non-empty string) and type (Income/Expense) are required.' });
    return;
  }

  try {
    const newCategory = await categoryService.createCategory(userId, payload);
    res.status(201).json({ success: true, data: newCategory });
  } catch (error: any) {
    // Handle Prisma unique constraint violation (P2002) for the combination of userId and name
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        res.status(409).json({ success: false, message: 'A category with this name already exists for this user.' });
    } else {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, message: 'Failed to create category.' });
    }
  }
}

/**
 * PUT /api/category/:id
 * Updates an existing category.
 */
export async function updateCategory(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId;
  const categoryId = req.params.id;
  const payload: Partial<CategoryCreateUpdatePayload> = req.body;

  if (!userId) {
    res.status(401).json({ success: false, message: 'User not authenticated.' });
    return;
  }

  // Basic validation for update payload: ensure at least one field is provided and valid
  const { name, type } = payload;
  const isNameValid = name === undefined || (typeof name === 'string' && name.trim().length > 0);
  const isTypeValid = type === undefined || (type === 'Income' || type === 'Expense');

  if (!isNameValid || !isTypeValid || (name === undefined && type === undefined)) {
    res.status(400).json({ success: false, message: 'Invalid or missing fields in update request.' });
    return;
  }

  try {
    const dataToUpdate = { name, type };
    if (name === undefined) delete dataToUpdate.name;
    if (type === undefined) delete dataToUpdate.type;

    const updatedCategory = await categoryService.updateCategory(categoryId, userId, dataToUpdate);
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // Not found or failed ownership check
        res.status(404).json({ success: false, message: 'Category not found or does not belong to user.' });
      } else if (error.code === 'P2002') { // Unique constraint violation
        res.status(409).json({ success: false, message: 'A category with this name already exists for this user.' });
      } else {
        console.error('Prisma Error updating category:', error);
        res.status(500).json({ success: false, message: 'Failed to update category.' });
      }
    } else {
      console.error('Error updating category:', error);
      res.status(500).json({ success: false, message: 'Failed to update category.' });
    }
  }
}

/**
 * DELETE /api/category/:id
 * Deletes a category.
 */
export async function deleteCategory(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId;
  const categoryId = req.params.id;

  if (!userId) {
    res.status(401).json({ success: false, message: 'User not authenticated.' });
    return;
  }

  try {
    const deletedCategory = await categoryService.deleteCategory(categoryId, userId);
    // Although the deleted object is returned, we send a generic success message
    res.status(200).json({ success: true, data: deletedCategory, message: 'Category deleted successfully.' });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Category not found or does not belong to user.' });
    } else {
      console.error('Error deleting category:', error);
      res.status(500).json({ success: false, message: 'Failed to delete category.' });
    }
  }
}
