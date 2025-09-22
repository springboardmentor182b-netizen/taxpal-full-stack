import Category, { ICategory } from "./category.model";

export const createCategory = async (data: Partial<ICategory>, userId: string) => {
  const category = new Category({ ...data, createdBy: userId });
  return await category.save();
};

export const getUserCategories = async (userId: string) => {
  return await Category.find({ createdBy: userId });
};

export const updateCategory = async (id: string, data: Partial<ICategory>, userId: string) => {
  return await Category.findOneAndUpdate({ _id: id, createdBy: userId }, data, { new: true });
};

export const deleteCategory = async (id: string, userId: string) => {
  return await Category.findOneAndDelete({ _id: id, createdBy: userId });
};
