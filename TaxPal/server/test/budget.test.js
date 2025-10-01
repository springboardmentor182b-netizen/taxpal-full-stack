const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const app = express();
const userRoutes = require('../routes/user');

let mongoServer;

// Set up the app
app.use(express.json());
app.use('/api/users', userRoutes);

// Connect to a new in-memory database before running any tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Disconnect and close connection after all tests have finished
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Simple Budget API Tests', () => {
  // Test creating a budget
  test('POST /api/users/add-simple-budget should create a new budget', async () => {
    const response = await request(app)
      .post('/api/users/add-simple-budget')
      .send({ amount: 500 });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Budget added');
    expect(response.body.budget).toBeDefined();
    expect(response.body.budget.amount).toBe(500);
  });

  // Test validation for negative amount
  test('POST /api/users/add-simple-budget should reject negative amount', async () => {
    const response = await request(app)
      .post('/api/users/add-simple-budget')
      .send({ amount: -100 });

    expect(response.statusCode).toBe(400);
  });

  // Test fetching all budgets
  test('GET /api/users/simple-budget-list should return all budgets', async () => {
    // First create a budget to make sure we have one
    await request(app)
      .post('/api/users/add-simple-budget')
      .send({ amount: 1000 });
    
    const response = await request(app)
      .get('/api/users/simple-budget-list');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
