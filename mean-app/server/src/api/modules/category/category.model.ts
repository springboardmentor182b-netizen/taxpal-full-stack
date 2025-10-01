/**
 * Defines the structure of the Category data model,
 * matching the Prisma schema.
 */
export interface Category {
  id: string;
  name: string;
  type: 'Income' | 'Expense'; // Type must match the Prisma definition
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Defines the request body shape for creating or updating a category.
 * userId is excluded as it comes from the auth middleware (req.userId).
 */
export interface CategoryCreateUpdatePayload {
  name: string;
  type: 'Income' | 'Expense';
}
