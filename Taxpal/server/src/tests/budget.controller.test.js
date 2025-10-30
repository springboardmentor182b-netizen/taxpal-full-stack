// Mock the service FIRST so it's in place before requiring the controller
jest.mock('./budget.service', () => ({
  budgetService: {
    create: jest.fn(),
    findAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

// Now require the modules under test (CJS require works with TS compiled to CJS)
const { budgetController } = require('./budget.controller');
const { budgetService } = require('./budget.service');

function mockReq(body = {}, query = {}, headers = {}, user) {
  // make headers case-insensitive
  const H = {};
  Object.keys(headers || {}).forEach((k) => (H[k.toLowerCase()] = headers[k]));
  return {
    body,
    query,
    headers: H,
    header(name) {
      return H[String(name).toLowerCase()];
    },
    params: {},
    user,
  };
}

function mockRes() {
  const res = {
    statusCode: 200,
    body: undefined,
    status: jest.fn(function (code) {
      this.statusCode = code;
      return this;
    }),
    json: jest.fn(function (payload) {
      this.body = payload;
      return this;
    }),
  };
  return res;
}

describe('budgetController', () => {
  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    test('201 on success, passes sanitized payload to service', async () => {
      budgetService.create.mockResolvedValue({ _id: 'new' });

      const req = mockReq(
        { category: '  Food ', amount: '1500', month: '2025-10', description: '  hello ' },
        {},
        { 'x-user-id': '65f27f2bcf7cd8a0b6a4c001' }
      );
      const res = mockRes();

      await budgetController.create(req, res);

      expect(budgetService.create).toHaveBeenCalledWith({
        userId: '65f27f2bcf7cd8a0b6a4c001',
        category: 'Food',
        amount: 1500,
        month: '2025-10',
        monthStart: undefined,
        description: 'hello',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ _id: 'new' });
    });

    test('400 when month invalid (guard in controller)', async () => {
      const req = mockReq({ category: 'Rent', amount: 100, month: '2025-13' });
      const res = mockRes();

      await budgetController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body.error).toMatch(/YYYY-MM/);
      expect(budgetService.create).not.toHaveBeenCalled();
    });

    test('409 when service throws duplicate (code 11000)', async () => {
      budgetService.create.mockRejectedValue({ code: 11000 });

      const req = mockReq({ category: 'Rent', amount: 100, month: '2025-10' });
      const res = mockRes();

      await budgetController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.body.error).toMatch(/already exists/i);
    });
  });

  describe('list', () => {
    test('forwards filters to service and responds with array', async () => {
      budgetService.findAll.mockResolvedValue([{ _id: 'a' }]);

      const req = mockReq({}, { month: '2025-10', category: 'Rent', limit: '5', skip: '2' });
      const res = mockRes();

      await budgetController.list(req, res);

      expect(budgetService.findAll).toHaveBeenCalledWith({
        userId: undefined,
        month: '2025-10',
        category: 'Rent',
        limit: 5,
        skip: 2,
      });
      expect(res.json).toHaveBeenCalledWith([{ _id: 'a' }]);
    });
  });

  describe('getOne', () => {
    test('404 when not found', async () => {
      budgetService.getById.mockResolvedValue(null);

      const req = mockReq(); req.params = { id: 'x' };
      const res = mockRes();

      await budgetController.getOne(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.body.error).toMatch(/not found/i);
    });

    test('200 when found', async () => {
      budgetService.getById.mockResolvedValue({ _id: 'ok' });

      const req = mockReq(); req.params = { id: 'x' };
      const res = mockRes();

      await budgetController.getOne(req, res);
      expect(res.json).toHaveBeenCalledWith({ _id: 'ok' });
    });
  });

  describe('update', () => {
    test('200 with updated; 404 if null', async () => {
      budgetService.update.mockResolvedValue({ _id: 'upd' });

      const req = mockReq({ category: 'New' }); req.params = { id: 'x' };
      const res = mockRes();

      await budgetController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ _id: 'upd' });

      budgetService.update.mockResolvedValue(null);
      const res2 = mockRes();
      await budgetController.update(req, res2);
      expect(res2.status).toHaveBeenCalledWith(404);
    });

    test('maps duplicate to 409 and validation to 400', async () => {
      const req = mockReq({}); req.params = { id: 'x' };

      budgetService.update.mockRejectedValue({ code: 11000 });
      const res409 = mockRes();
      await budgetController.update(req, res409);
      expect(res409.status).toHaveBeenCalledWith(409);

      budgetService.update.mockRejectedValue({
        name: 'ValidationError',
        errors: { x: { message: 'bad' } },
      });
      const res400 = mockRes();
      await budgetController.update(req, res400);
      expect(res400.status).toHaveBeenCalledWith(400);
      expect(res400.body.error).toBe('bad');
    });
  });

  describe('remove', () => {
    test('200 {ok:true} when removed; 404 otherwise', async () => {
      budgetService.remove.mockResolvedValue(true);

      const req = mockReq(); req.params = { id: 'x' };
      const res = mockRes();

      await budgetController.remove(req, res);
      expect(res.json).toHaveBeenCalledWith({ ok: true });

      budgetService.remove.mockResolvedValue(false);
      const res2 = mockRes();
      await budgetController.remove(req, res2);
      expect(res2.status).toHaveBeenCalledWith(404);
    });
  });
});
