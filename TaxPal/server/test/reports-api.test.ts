import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Income from '../models/Income';
import Expense from '../models/Expense';

const app = express();
app.use(express.json());

// Import routes
const reportRoutes = require('../routes/reports');
app.use('/api/reports', reportRoutes);

let mongoServer: MongoMemoryServer;

describe('Reports API', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = new MongoMemoryServer();
    await mongoServer.start();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear collections
    await Income.deleteMany({});
    await Expense.deleteMany({});
  });

  // Test Case 1: Generate Report Endpoint Test
  describe('POST /api/reports/generate-report', () => {
    it('should generate CSV report successfully', async () => {
      // Create test data
      const userEmail = 'test@example.com';
      const year = 2024;

      await Income.create([
        { userEmail, amount: 5000, date: new Date('2024-01-15'), description: 'Salary' },
        { userEmail, amount: 3000, date: new Date('2024-02-15'), description: 'Bonus' }
      ]);

      await Expense.create([
        { userEmail, amount: 1000, date: new Date('2024-01-10'), description: 'Rent' },
        { userEmail, amount: 500, date: new Date('2024-02-05'), description: 'Food' }
      ]);

      const response = await request(app)
        .post('/api/reports/generate-report')
        .send({
          format: 'csv',
          year: year,
          data: { userEmail }
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('financial-report-2024.csv');
      expect(response.text).toContain('Period,Income,Expenses,Net Income,Transactions');
    });

    it('should return 400 for invalid format', async () => {
      const response = await request(app)
        .post('/api/reports/generate-report')
        .send({
          format: 'invalid',
          year: 2024
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid format specified');
    });
  });

  // Test Case 2: Report Preview Endpoint Test
  describe('POST /api/reports/preview-report', () => {
    it('should generate report preview successfully', async () => {
      const userEmail = 'test@example.com';
      const year = 2024;

      await Income.create([
        { userEmail, amount: 6000, date: new Date('2024-04-15'), description: 'Consulting' }
      ]);

      await Expense.create([
        { userEmail, amount: 800, date: new Date('2024-04-10'), description: 'Utilities' }
      ]);

      const response = await request(app)
        .post('/api/reports/preview-report')
        .send({
          reportType: 'financial_summary',
          userEmail,
          year
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('reports');
      expect(response.body.data).toHaveProperty('yearSummary');
      expect(Array.isArray(response.body.data.reports)).toBe(true);
    });

    it('should handle empty data gracefully', async () => {
      const response = await request(app)
        .post('/api/reports/preview-report')
        .send({
          reportType: 'financial_summary',
          userEmail: 'nonexistent@example.com',
          year: 2024
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.reports.length).toBe(12); // 12 months
      expect(response.body.data.yearSummary.totalIncome).toBe(0);
      expect(response.body.data.yearSummary.totalExpenses).toBe(0);
    });
  });
});
