import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import budgetRouter from "../api/modules/budget/budget.routes";
import { Budget } from "../api/modules/budget/budget.model";

const app = express();
app.use(express.json());
app.use('/api/v1/budgets', budgetRouter);

describe('Budget API Functional Tests', () => {
  let mongoServer: MongoMemoryServer;
  let createdBudgetId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Budget.deleteMany({});
  });

  // -----------------------------
  // Happy path tests
  // -----------------------------
  it('POST /api/v1/budgets - create budget', async () => {
    const res = await request(app)
      .post('/api/v1/budgets')
      .send({
        category: 'Marketing',
        amount: 300,
        spent: 50,
        month: 'October',
        description: 'Test budget',
        userId: 'user123'
      })
      .expect(201);

    expect(res.body._id).toBeDefined();
    expect(res.body.remaining).toBe(250);
    expect(res.body.status).toBe('Fair');
    createdBudgetId = res.body._id;
  });

  it('GET /api/v1/budgets/:id - fetch budgets for user', async () => {
    await Budget.create({
      category: 'Travel',
      amount: 600,
      spent: 100,
      month: 'October',
      userId: 'user123'
    });

    const res = await request(app)
      .get('/api/v1/budgets/user123')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].userId).toBe('user123');
    expect(res.body[0].remaining).toBeDefined();
    expect(res.body[0].status).toBeDefined();
  });

  it('DELETE /api/v1/budgets/:id - delete budget', async () => {
    const budget = await Budget.create({
      category: 'Food',
      amount: 200,
      spent: 50,
      month: 'October',
      userId: 'user123'
    });

    const res = await request(app)
      .delete(`/api/v1/budgets/${budget._id}`)
      .expect(200);

    expect(res.body.message).toBe('Budget deleted successfully');

    const deleted = await Budget.findById(budget._id);
    expect(deleted).toBeNull();
  });

  // -----------------------------
  // Error handling tests
  // -----------------------------
  it('POST /api/v1/budgets - missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/budgets')
      .send({ category: 'Food' }) // missing amount, month, userId
      .expect(400);

    expect(res.body.message).toBe('Missing required fields');
  });

  it('GET /api/v1/budgets/:id - user has no budgets', async () => {
    const res = await request(app)
      .get('/api/v1/budgets/nonexistentuser')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('DELETE /api/v1/budgets/:id - non-existent budget', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/v1/budgets/${fakeId}`)
      .expect(404);

    expect(res.body.message).toBe('Budget not found');
  });

  it('DELETE /api/v1/budgets/:id - missing budgetId', async () => {
    const res = await request(app)
      .delete('/api/v1/budgets/')
      .expect(404); // Express route requires :id, so 404 is returned
  });
});
