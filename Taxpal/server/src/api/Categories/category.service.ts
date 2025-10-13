import { Category, ICategory } from './category.model';

export const createCategory = async (data: Partial<ICategory>) =>
  Category.create(data);

export const getCategories = async () =>
  Category.find();

export const updateCategory = async (id: string, data: Partial<ICategory>) =>
  Category.findByIdAndUpdate(id, data, { new: true });

export const deleteCategory = async (id: string) =>
  Category.findByIdAndDelete(id);
