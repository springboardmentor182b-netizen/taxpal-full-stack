const request = require('supertest');
const app = require('../server');

describe('Budget Management', () => {
  it('should set a new budget limit', async () => {
    const res = await request(app).post('/budgets').send({
      user_id: 1,
      category: 'Food',
      limit: 8000,
      month: 'October',
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Budget set successfully');
  });

  it('should retrieve existing budget for user', async () => {
    const res = await request(app).get('/budgets?user_id=1');
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('limit');
  });
});
