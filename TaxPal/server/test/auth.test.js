// server/test/auth.test.js
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

//
app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ message: 'Login route hit' });
});

app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'Register route hit' });
});

describe('Auth Routes', () => {
  it('should respond to POST /api/auth/login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login route hit');
  });

  it('should respond to POST /api/auth/register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'newuser@example.com', password: '123456' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Register route hit');
  });
});
