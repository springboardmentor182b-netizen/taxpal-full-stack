const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taxpal';

let db;

async function connectDB() {
  if (db) return db;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db();
  return db;
}

exports.createCategory = async (req, res) => {
  try {
    const collection = (await connectDB()).collection('categories');
    const category = { ...req.body, userId: new ObjectId(req.user._id) };
    const result = await collection.insertOne(category);
    category._id = result.insertedId;
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const collection = (await connectDB()).collection('categories');
    const categories = await collection.find({ userId: new ObjectId(req.user._id) }).toArray();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const collection = (await connectDB()).collection('categories');
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id), userId: new ObjectId(req.user._id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: "Not found" });
    const updated = await collection.findOne({ _id: new ObjectId(req.params.id) });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const collection = (await connectDB()).collection('categories');
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id), userId: new ObjectId(req.user._id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
