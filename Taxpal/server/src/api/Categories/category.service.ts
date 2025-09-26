import { Category, ICategory } from "../models/category.model";

// Create category
export const createCategory = async (data: Partial<ICategory>) => {
  return await Category.create(data);
};

// Get all categories (no user filter)
export const getCategories = async () => {
  return await Category.find();
};

// Update category by id
export const updateCategory = async (id: string, data: Partial<ICategory>) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

// Delete category by id
export const deleteCategory = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};
