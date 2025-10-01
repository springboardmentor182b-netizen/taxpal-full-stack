const Category = require('./categoriesModel');

// GET all categories
exports.getAll = async (q) => {
  try {
    let filter = {};
    if (q) {
      filter = { $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]};
    }
    const categories = await Category.find(filter);
    return categories;
  } catch (err) {
    throw new Error(err.message);
  }
};

// GET category by ID
exports.getById = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) throw new Error('Category not found');
    return category;
  } catch (err) {
    throw new Error(err.message);
  }
};

// CREATE new category
exports.create = async (name, description, isActive) => {
  try {
    if (!name) throw new Error('Name is required');
    const category = new Category({ name, description, isActive });
    const saved = await category.save();
    return saved;
  } catch (err) {
    throw new Error(err.message);
  }
};

// UPDATE category
exports.update = async (id, name, description, isActive) => {
  try {
    const category = await Category.findById(id);
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

// DELETE category
exports.remove = async (id) => {
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error('Category not found');
    return { message: 'Deleted successfully', item: category };
  } catch (err) {
    throw new Error(err.message);
  }
};
