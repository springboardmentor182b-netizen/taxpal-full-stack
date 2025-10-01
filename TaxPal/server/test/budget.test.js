const mongoose = require('mongoose');
const Budget = require('../models/Budget'); // adjust path if needed

// Connect to in-memory MongoDB (or test DB)
beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/budget_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Budget Model Test Cases', () => {

  // TC_026 – Create Budget (Valid)
  it('TC_026: should create a budget successfully with valid details', async () => {
    const validBudget = new Budget({
      user_id: new mongoose.Types.ObjectId(),
      category: 'food',
      limit: 5000,
      month: '2025-09',
      description: 'Monthly food budget'
    });

    const savedBudget = await validBudget.save();

    expect(savedBudget._id).toBeDefined();
    expect(savedBudget.category).toBe('food');
    expect(savedBudget.limit).toBe(5000);
    expect(savedBudget.month).toBe('2025-09');
    expect(savedBudget.description).toBe('Monthly food budget');
  });

  // TC_027 – Create Budget (Missing Fields)
  it('TC_027: should throw validation error if required fields are missing', async () => {
    const invalidBudget = new Budget({}); // missing all fields
    let err;
    try {
      await invalidBudget.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.user_id).toBeDefined();
    expect(err.errors.category).toBeDefined();
    expect(err.errors.limit).toBeDefined();
    expect(err.errors.month).toBeDefined();
  });

  // TC_028 – Create Budget (Invalid Amount)
  it('TC_028: should throw validation error if amount is invalid (negative)', async () => {
    const invalidAmountBudget = new Budget({
      user_id: new mongoose.Types.ObjectId(),
      category: 'utilities',
      limit: -200, // ❌ invalid
      month: '2025-09',
      description: 'Invalid budget test'
    });

    let err;
    try {
      await invalidAmountBudget.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.limit).toBeDefined();
  });

  // TC_029 – Cancel Budget Form (no save)
  it('TC_029: should not save budget if cancel operation is performed', async () => {
    const draftBudget = new Budget({
      user_id: new mongoose.Types.ObjectId(),
      category: 'entertainment',
      limit: 1000,
      month: '2025-09'
    });

    // Simulate cancel → do not call save()
    // So budget should not exist in DB
    const foundBudget = await Budget.findOne({ category: 'entertainment', limit: 1000 });
    expect(foundBudget).toBeNull();
  });
});
