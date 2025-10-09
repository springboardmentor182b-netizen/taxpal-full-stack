const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true, min: [1, "Amount must be greater than 0"] },
  date: { type: Date, required: true },
});

const Transaction = model("Transaction", TransactionSchema);

describe("🧾 Income Validation - Mongoose Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/taxpal_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Transaction.deleteMany({});
  });

  // Test Case 1: Reject invalid (negative or zero) income
  it("should reject income with invalid amount (negative or zero)", async () => {
    const invalidIncome = new Transaction({
      user_id: new mongoose.Types.ObjectId(),
      type: "income",
      category: "Salary",
      amount: 0, // invalid
      date: new Date(),
    });

    await expect(invalidIncome.save()).rejects.toThrow(/Amount must be greater than 0/);
  });

  // Test Case 2: Reject missing required fields
  it("should reject income without required fields", async () => {
    const incompleteIncome = new Transaction({
      type: "income",
      amount: 5000,
    });

    await expect(incompleteIncome.save()).rejects.toThrow();
  });

  // Test Case 3: Successfully save valid income
  it("should save a valid income transaction successfully", async () => {
    const validIncome = new Transaction({
      user_id: new mongoose.Types.ObjectId(),
      type: "income",
      category: "Freelancing",
      amount: 2500,
      date: new Date(),
    });

    const saved = await validIncome.save();

    expect(saved._id).toBeDefined();
    expect(saved.type).toBe("income");
    expect(saved.amount).toBe(2500);
    expect(saved.category).toBe("Freelancing");
  });

  // Test Case 4: Reject invalid transaction type
  it("should reject invalid transaction type", async () => {
    const invalidType = new Transaction({
      user_id: new mongoose.Types.ObjectId(),
      type: "bonus", // invalid
      category: "Gift",
      amount: 200,
      date: new Date(),
    });

    await expect(invalidType.save()).rejects.toThrow(/`bonus` is not a valid enum value/);
  });

  // Test Case 5: Ensure date validation works
  it("should reject transaction without a date", async () => {
    const invalidDate = new Transaction({
      user_id: new mongoose.Types.ObjectId(),
      type: "income",
      category: "Project",
      amount: 1000,
    });

    await expect(invalidDate.save()).rejects.toThrow();
  });

  // Test Case 6: Reject missing category
  it("should reject income entry without category", async () => {
    const invalidCategory = new Transaction({
      user_id: new mongoose.Types.ObjectId(),
      type: "income",
      amount: 1200,
      date: new Date(),
    });

    await expect(invalidCategory.save()).rejects.toThrow(/`category` is required/);
  });

  // Test Case 7: Accept large valid income amount
  it("should accept very large valid income amounts", async () => {
    const largeIncome = new Transaction({
      user_id: new mongoose.Types.ObjectId(),
      type: "income",
      category: "Investment Return",
      amount: 999999999,
      date: new Date(),
    });

    const saved = await largeIncome.save();
    expect(saved.amount).toBe(999999999);
  });

  // Test Case 8: Reject invalid data type for amount (string instead of number)
  it("should reject income when amount is not a number", async () => {
    const invalidTypeAmount = new Transaction({
      user_id: new mongoose.Types.ObjectId(),
      type: "income",
      category: "Salary",
      amount: "Five Thousand", //  invalid
      date: new Date(),
    });

    await expect(invalidTypeAmount.save()).rejects.toThrow();
  });
});

