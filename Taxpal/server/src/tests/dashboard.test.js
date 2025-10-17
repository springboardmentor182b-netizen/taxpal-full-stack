const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ["income", "expense"], required: true },
  category: String,
  amount: Number,
  date: Date,
});

const BudgetSchema = new Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  category: String,
  limit: Number,
  month: String,
});

const TaxEstimateSchema = new Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  quarter: String,
  estimated_tax: Number,
});

const ReportSchema = new Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  period: String,
  report_type: String,
  file_path: String,
});

const Transaction = model("Transaction", TransactionSchema);
const Budget = model("Budget", BudgetSchema);
const TaxEstimate = model("TaxEstimate", TaxEstimateSchema);
const Report = model("Report", ReportSchema);

describe(" Dashboard Module - TaxPal", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/taxpal_dashboard_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Promise.all([
      Transaction.deleteMany({}),
      Budget.deleteMany({}),
      TaxEstimate.deleteMany({}),
      Report.deleteMany({}),
    ]);
  });

  // Dashboard Loading Verification

  it("should successfully load the dashboard summary data", async () => {
   
    await Transaction.insertMany([
      { user_id: new mongoose.Types.ObjectId(), type: "income", amount: 10000, date: new Date() },
      { user_id: new mongoose.Types.ObjectId(), type: "expense", amount: 4000, date: new Date() },
    ]);

    const income = await Transaction.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expense = await Transaction.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const netBalance = (income[0]?.total || 0) - (expense[0]?.total || 0);
    expect(netBalance).toBe(6000);
  });

  // Transaction Loading Check
  it("should load user transactions successfully", async () => {
    const transaction = await Transaction.create({
      user_id: new mongoose.Types.ObjectId(),
      type: "income",
      category: "Freelance",
      amount: 5000,
      date: new Date(),
    });

    const result = await Transaction.findById(transaction._id);
    expect(result.type).toBe("income");
    expect(result.amount).toBe(5000);
    expect(result.category).toBe("Freelance");
  });

  // Budgets Loading Test

  it("should fetch all budgets for user", async () => {
    await Budget.create({
      user_id: new mongoose.Types.ObjectId(),
      category: "Food",
      limit: 8000,
      month: "October",
    });

    const budgets = await Budget.find({});
    expect(budgets.length).toBeGreaterThan(0);
    expect(budgets[0].category).toBe("Food");
  });

  // Tax Estimator Data Loading

  it("should fetch quarterly tax estimation data", async () => {
    await TaxEstimate.create({
      user_id: new mongoose.Types.ObjectId(),
      quarter: "Q3",
      estimated_tax: 15000,
    });

    const estimate = await TaxEstimate.findOne({ quarter: "Q3" });
    expect(estimate.estimated_tax).toBe(15000);
  });

  // Reports Data Loading

  it("should fetch reports data correctly", async () => {
    await Report.create({
      user_id: new mongoose.Types.ObjectId(),
      period: "Q2 2025",
      report_type: "summary",
      file_path: "/reports/Q2_user1.pdf",
    });

    const report = await Report.findOne({ period: "Q2 2025" });
    expect(report.report_type).toBe("summary");
    expect(report.file_path).toContain("Q2_user1.pdf");
  });

  // Combined Dashboard Data Integration

  it("should correctly aggregate all module data for dashboard view", async () => {
    await Promise.all([
      Transaction.insertMany([
        { user_id: new mongoose.Types.ObjectId(), type: "income", amount: 7000, date: new Date() },
        { user_id: new mongoose.Types.ObjectId(), type: "expense", amount: 3000, date: new Date() },
      ]),
      Budget.create({ user_id: new mongoose.Types.ObjectId(), category: "Travel", limit: 5000, month: "September" }),
      TaxEstimate.create({ user_id: new mongoose.Types.ObjectId(), quarter: "Q4", estimated_tax: 18000 }),
      Report.create({ user_id: new mongoose.Types.ObjectId(), period: "Q3 2025", report_type: "detailed", file_path: "/reports/Q3_user2.pdf" }),
    ]);

    const totalIncome = await Transaction.aggregate([{ $match: { type: "income" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
    const totalExpense = await Transaction.aggregate([{ $match: { type: "expense" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
    const totalBudgets = await Budget.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalTaxEstimates = await TaxEstimate.countDocuments();

    expect(totalIncome[0].total).toBe(7000);
    expect(totalExpense[0].total).toBe(3000);
    expect(totalBudgets).toBeGreaterThanOrEqual(1);
    expect(totalReports).toBeGreaterThanOrEqual(1);
    expect(totalTaxEstimates).toBeGreaterThanOrEqual(1);
  });

  // Dashboard Empty State Handling
 
  it("should handle dashboard loading gracefully when no data exists", async () => {
    const income = await Transaction.countDocuments();
    const budgets = await Budget.countDocuments();
    const tax = await TaxEstimate.countDocuments();
    const reports = await Report.countDocuments();

    expect(income).toBe(0);
    expect(budgets).toBe(0);
    expect(tax).toBe(0);
    expect(reports).toBe(0);
  });
});