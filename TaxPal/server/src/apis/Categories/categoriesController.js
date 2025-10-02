const Category = require('./categoriesModel');

// GET all categories for a user
exports.getAll = async (userId, q) => {
  try {
    let filter = { userId };
    if (q) {
      filter = {
        userId,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      };
    }
    const categories = await Category.find(filter);
    return categories;
  } catch (err) {
    throw new Error(err.message);
  }
};

// GET category by ID for a user
exports.getById = async (userId, id) => {
  try {
    const category = await Category.findOne({ _id: id, userId });
    if (!category) throw new Error('Category not found');
    return category;
  } catch (err) {
    throw new Error(err.message);
  }
};

// CREATE new category for a user
exports.create = async (userId, name, description, isActive) => {
  try {
    if (!name) throw new Error('Name is required');
    const category = new Category({ userId, name, description, isActive });
    const saved = await category.save();
    return saved;
  } catch (err) {
    throw new Error(err.message);
  }
};

// UPDATE category for a user
exports.update = async (userId, id, name, description, isActive) => {
  try {
    const category = await Category.findOne({ _id: id, userId });
    if (!category) throw new Error('Category not found');
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;
    const updated = await category.save();
    return updated;
  } catch (err) {
    throw new Error(err.message);
  }
};

// DELETE category for a user
exports.remove = async (userId, id) => {
  try {
    const category = await Category.findOneAndDelete({ _id: id, userId });
    if (!category) throw new Error('Category not found');
    return { message: 'Deleted successfully', item: category };
  } catch (err) {
    throw new Error(err.message);
  }
};
