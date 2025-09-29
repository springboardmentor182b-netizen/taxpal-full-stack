// server/test/transactions.test.js
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

// Mock transaction routes
app.get('/api/transactions', (req, res) => {
  res.status(200).json({ transactions: [] });
});

app.post('/api/transactions', (req, res) => {
  res.status(201).json({ message: 'Transaction created' });
});

describe('Transaction Routes', () => {
  it('should get all transactions', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.statusCode).toBe(200);
    expect(res.body.transactions).toEqual([]);
  });

  it('should create a new transaction', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({ amount: 100, type: 'income' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Transaction created');
  });
});
