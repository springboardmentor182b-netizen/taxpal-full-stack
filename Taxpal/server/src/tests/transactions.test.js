const request = require('supertest');
const app = require('../server');

describe('Transaction Management', () => {
  it('should add a new transaction', async () => {
    const res = await request(app).post('/transactions').send({
      user_id: 1,
      type: 'income',
      category: 'Freelance',
      amount: 7000,
      date: '2025-10-05',
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Transaction added successfully');
  });

  it('should fetch all transactions for a user', async () => {
    const res = await request(app).get('/transactions?user_id=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });
});
