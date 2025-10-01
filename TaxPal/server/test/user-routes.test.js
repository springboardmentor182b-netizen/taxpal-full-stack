const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const userRoutes = require('../routes/user');
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const SimpleBudget = require('../models/SimpleBudget');

// Set up Express app for testing
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

// Setup in-memory MongoDB server
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  // Clear all collections before each test
  await User.deleteMany({});
  await Income.deleteMany({});
  await Expense.deleteMany({});
  await SimpleBudget.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User API Routes', () => {
  describe('POST /api/users/register', () => {
    test('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        country: 'Test Country'
      };

      const res = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered');
      expect(res.body.user.email).toBe(userData.email);
      expect(res.body.user.name).toBe(userData.name);
    });

    test('should return 400 if email or name is missing', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ email: 'test@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeTruthy();
    });

    test('should return 409 if user already exists', async () => {
      const userData = {
        email: 'duplicate@example.com',
        name: 'Duplicate User'
      };

      // Create first user
      await request(app)
        .post('/api/users/register')
        .send(userData);

      // Try to create duplicate
      const res = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('POST /api/users/signin', () => {
    test('should sign in existing user', async () => {
      // Create a user first
      const user = new User({
        email: 'signin@example.com',
        name: 'Sign In User'
      });
      await user.save();

      // Sign in
      const res = await request(app)
        .post('/api/users/signin')
        .send({ email: 'signin@example.com' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Sign in successful');
      expect(res.body.user.email).toBe('signin@example.com');
      expect(res.body.user.initial).toBeTruthy();
    });

    test('should return 404 if user does not exist', async () => {
      const res = await request(app)
        .post('/api/users/signin')
        .send({ email: 'nonexistent@example.com' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBeTruthy();
    });

    test('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/users/signin')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('POST /api/users/add-income', () => {
    test('should add income for a user', async () => {
      const incomeData = {
        title: 'Test Income',
        amount: 1000,
        category: 'Salary',
        date: new Date().toISOString(),
        notes: 'Test note',
        userEmail: 'income@example.com'
      };

      const res = await request(app)
        .post('/api/users/add-income')
        .send(incomeData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Income added');
      expect(res.body.income.title).toBe(incomeData.title);
      expect(res.body.income.amount).toBe(incomeData.amount);
    });

    test('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/users/add-income')
        .send({ title: 'Incomplete' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('POST /api/users/add-expense', () => {
    test('should add expense for a user', async () => {
      const expenseData = {
        title: 'Test Expense',
        amount: 500,
        category: 'Food',
        date: new Date().toISOString(),
        notes: 'Test note',
        taxDeductible: true,
        userEmail: 'expense@example.com'
      };

      const res = await request(app)
        .post('/api/users/add-expense')
        .send(expenseData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Expense added');
      expect(res.body.expense.title).toBe(expenseData.title);
      expect(res.body.expense.amount).toBe(expenseData.amount);
      expect(res.body.expense.taxDeductible).toBe(expenseData.taxDeductible);
    });

    test('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/users/add-expense')
        .send({ title: 'Incomplete' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('POST /api/users/add-simple-budget', () => {
    test('should add a simple budget', async () => {
      const budgetData = {
        amount: 1500
      };

      const res = await request(app)
        .post('/api/users/add-simple-budget')
        .send(budgetData);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Budget added');
      expect(res.body.budget.amount).toBe(budgetData.amount);
    });

    test('should return 400 if amount is negative', async () => {
      const res = await request(app)
        .post('/api/users/add-simple-budget')
        .send({ amount: -100 });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeTruthy();
    });
  });

  describe('GET /api/users/income-list', () => {
    test('should get income list for a user', async () => {
      // Add some test incomes first
      const userEmail = 'income-list@example.com';
      await Income.create([
        { title: 'Income 1', amount: 1000, category: 'Salary', date: new Date(), userEmail },
        { title: 'Income 2', amount: 2000, category: 'Bonus', date: new Date(), userEmail }
      ]);

      const res = await request(app)
        .get(`/api/users/income-list?userEmail=${userEmail}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].title).toBeTruthy();
      expect(res.body[1].title).toBeTruthy();
    });

    test('should return empty array if no incomes found', async () => {
      const res = await request(app)
        .get('/api/users/income-list?userEmail=no-incomes@example.com');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/users/expense-list', () => {
    test('should get expense list for a user', async () => {
      // Add some test expenses first
      const userEmail = 'expense-list@example.com';
      await Expense.create([
        { title: 'Expense 1', amount: 500, category: 'Food', date: new Date(), userEmail },
        { title: 'Expense 2', amount: 300, category: 'Transport', date: new Date(), userEmail }
      ]);

      const res = await request(app)
        .get(`/api/users/expense-list?userEmail=${userEmail}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].title).toBeTruthy();
      expect(res.body[1].title).toBeTruthy();
    });

    test('should return empty array if no expenses found', async () => {
      const res = await request(app)
        .get('/api/users/expense-list?userEmail=no-expenses@example.com');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('GET /api/users/simple-budget-list', () => {
    test('should get all simple budgets', async () => {
      // Add some test budgets first
      await SimpleBudget.create([
        { amount: 1000 },
        { amount: 1500 }
      ]);

      const res = await request(app)
        .get('/api/users/simple-budget-list');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].amount).toBeTruthy();
      expect(res.body[1].amount).toBeTruthy();
    });
  });
});
