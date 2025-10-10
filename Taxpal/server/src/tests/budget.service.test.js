// backend/src/modules/budgets/budget.service.test.js

const { Types } = require('mongoose');

// ✅ Mock the Budget model exactly as the service imports it: './budget.model'
jest.mock('./budget.model', () => {
  const m = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };
  return { __esModule: true, default: m, Budget: m };
});

// Now require AFTER the mock
const Budget = require('./budget.model').default;
const { budgetService } = require('./budget.service');

describe('budgetService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create(): trims fields, converts userId, auto-computes monthStart (UTC 1st)', async () => {
    Budget.create.mockImplementation(async (doc) => doc);

    const out = await budgetService.create({
      userId: '65f27f2bcf7cd8a0b6a4c001',
      category: '  Groceries  ',
      amount: 1200,
      month: '2025-10',
      description: '  wk1 ',
    });

    expect(Budget.create).toHaveBeenCalled();
    const arg = Budget.create.mock.calls[0][0];

    expect(arg.userId instanceof Types.ObjectId).toBe(true);
    expect(arg.category).toBe('Groceries');
    expect(arg.description).toBe('wk1');
    expect(arg.amount).toBe(1200);
    expect(arg.month).toBe('2025-10');
    expect(arg.monthStart.toISOString()).toBe('2025-10-01T00:00:00.000Z');

    expect(out.monthStart.toISOString()).toBe('2025-10-01T00:00:00.000Z');
  });

  test('create(): rejects on invalid month', async () => {
    await expect(
      budgetService.create({ category: 'X', amount: 1, month: '2025-13' })
    ).rejects.toThrow(/YYYY-MM/);
  });

  test('findAll(): builds query, sorts, skips & limits, returns exec()', async () => {
    const exec = jest.fn().mockResolvedValue([{ _id: '1' }]);
    const limit = jest.fn().mockReturnValue({ exec });
    const skip = jest.fn().mockReturnValue({ limit, exec });
    const sort = jest.fn().mockReturnValue({ skip, limit, exec });

    Budget.find.mockReturnValue({ sort });

    const out = await budgetService.findAll({
      userId: 'u1',
      month: '2025-10',
      category: 'Rent',
      limit: 10,
      skip: 5,
    });

    expect(Budget.find).toHaveBeenCalledWith({
      userId: 'u1',
      month: '2025-10',
      category: 'Rent',
    });
    expect(sort).toHaveBeenCalledWith({ monthStart: -1, category: 1 });
    expect(skip).toHaveBeenCalledWith(5);
    expect(limit).toHaveBeenCalledWith(10);
    expect(out).toEqual([{ _id: '1' }]);
  });

  test('getById(): includes userId when provided', async () => {
    const exec = jest.fn().mockResolvedValue({ _id: 'x' });
    Budget.findOne.mockReturnValue({ exec });

    await budgetService.getById('bid', 'u1');
    expect(Budget.findOne).toHaveBeenCalledWith({ _id: 'bid', userId: 'u1' });
  });

  test('update(): recomputes monthStart when month changes; trims & normalizes', async () => {
    const exec = jest.fn().mockResolvedValue({ _id: 'ok' });
    Budget.findOneAndUpdate.mockReturnValue({ exec });

    await budgetService.update('id1', {
      month: '2025-11',
      description: '  note ',
      category: '  Utilities ',
      amount: '2000',
    });

    const [q, update, opts] = Budget.findOneAndUpdate.mock.calls[0];
    expect(q).toEqual({ _id: 'id1' });
    expect(update.monthStart.toISOString()).toBe('2025-11-01T00:00:00.000Z');
    expect(update.description).toBe('note');
    expect(update.category).toBe('Utilities');
    expect(update.amount).toBe(2000);
    expect(opts).toEqual({ new: true, runValidators: true });
  });

  test('remove(): returns true when deletedCount > 0', async () => {
    const exec = jest.fn().mockResolvedValue({ deletedCount: 1 });
    Budget.deleteOne.mockReturnValue({ exec });

    const ok = await budgetService.remove('id9', 'u1');
    expect(ok).toBe(true);
  });
});
