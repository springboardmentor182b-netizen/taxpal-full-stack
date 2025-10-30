import { Category, ICategory } from './category.model';
import { Types } from 'mongoose';

function normalize(n?: string) {
  return (n ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function toObjectIdOrNull(val: unknown): Types.ObjectId | null {
  if (val == null) return null;
  if (val instanceof Types.ObjectId) return val;
  if (typeof val === 'string') return Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : null;
  return null;
}

export const createCategory = async (data: Partial<ICategory>) => {
  const normalizedName = normalize(data.name);
  const type = (data.type as ICategory['type'])!;
  const user = toObjectIdOrNull(data.user as any); // null when not provided/invalid

  // Friendly duplicate guard before hitting unique index
  const existing = await Category.findOne({ normalizedName, type, user });
  if (existing) {
    const err: any = new Error('Category with this name and type already exists');
    err.code = 11000;
    throw err;
  }

  return Category.create({ ...data, normalizedName, type, user });
};

export const getCategories = async () =>
  Category.find().sort({ type: 1, normalizedName: 1 });

export const updateCategory = async (id: string, data: Partial<ICategory>) => {
  const current = await Category.findById(id);
  if (!current) return null;

  const nextName = data.name ?? current.name;
  const nextType = (data.type as ICategory['type']) ?? current.type;
  const nextUser = current.user ?? null; // default null ensures consistency
  const nextNormalized = normalize(nextName);

  const dup = await Category.findOne({
    _id: { $ne: id },
    normalizedName: nextNormalized,
    type: nextType,
    user: nextUser
  });
  if (dup) {
    const err: any = new Error('Category with this name and type already exists');
    err.code = 11000;
    throw err;
  }

  return Category.findByIdAndUpdate(
    id,
    { ...data, normalizedName: nextNormalized, type: nextType, user: nextUser },
    { new: true }
  );
};

export const deleteCategory = async (id: string) =>
  Category.findByIdAndDelete(id);
