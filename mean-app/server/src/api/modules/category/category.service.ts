import { PrismaClient } from '@prisma/client';
import { Category, CategoryCreateUpdatePayload } from './category.model.js';

const prisma = new PrismaClient();

/**
 * Creates a new category for a specific user.
 * @param userId The ID of the user creating the category.
 * @param data The category name and type.
 * @returns The created Category object.
 */
export async function createCategory(userId: string, data: CategoryCreateUpdatePayload): Promise<Category> {
  const newCategory = await prisma.category.create({
    data: {
      ...data,
      userId: userId,
    },
  });
  return newCategory as Category;
}

/**
 * Fetches all categories for a specific user.
 * @param userId The ID of the user whose categories are being fetched.
 * @returns An array of Category objects.
 */
export async function getCategoriesByUserId(userId: string): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' }, // Sort alphabetically
  });
  return categories as Category[];
}

/**
 * Updates an existing category (name or type).
 * Ensures the category belongs to the user before updating.
 * @param id The ID of the category to update.
 * @param userId The ID of the owner user (for ownership check).
 * @param data The fields to update.
 * @returns The updated Category object.
 */
export async function updateCategory(id: string, userId: string, data: Partial<CategoryCreateUpdatePayload>): Promise<Category> {
  const updatedCategory = await prisma.category.update({
    where: { id: id, userId: userId }, // Crucial: Check both ID and ownership
    data: data,
  });
  return updatedCategory as Category;
}

/**
 * Deletes a category.
 * Ensures the category belongs to the user before deleting.
 * @param id The ID of the category to delete.
 * @param userId The ID of the owner user (for ownership check).
 * @returns The deleted Category object.
 */
export async function deleteCategory(id: string, userId: string): Promise<Category> {
  const deletedCategory = await prisma.category.delete({
    where: { id: id, userId: userId }, // Crucial: Check both ID and ownership
  });
  return deletedCategory as Category;
}
