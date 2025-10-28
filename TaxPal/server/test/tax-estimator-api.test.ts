import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import TaxEstimate from '../models/TaxEstimate';

const app = express();
app.use(express.json());

// Import routes
const taxEstimatorRoutes = require('../routes/taxEstimator');
app.use('/api/tax-estimator', taxEstimatorRoutes);

let mongoServer: MongoMemoryServer;

describe('Tax Estimator API', () => {
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
    // Clear collection
    await TaxEstimate.deleteMany({});
  });

  // Test Case 1: Calculate Tax Endpoint Test
  describe('POST /api/tax-estimator/calculate', () => {
    it('should calculate tax successfully with valid input', async () => {
      const taxData = {
        income: 50000,
        businessExpenses: 5000,
        retirement: 3000,
        healthInsurance: 2000,
        homeOffice: 1000
      };

      const response = await request(app)
        .post('/api/tax-estimator/calculate')
        .send(taxData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('taxableIncome');
      expect(response.body).toHaveProperty('estimatedTax');
      expect(response.body).toHaveProperty('effectiveTaxRate');
      expect(response.body).toHaveProperty('breakdown');

      // Verify calculations
      const expectedTaxable = 50000 - (5000 + 3000 + 2000 + 1000); // 35000
      expect(response.body.taxableIncome).toBe(expectedTaxable);
      expect(response.body.estimatedTax).toBe(expectedTaxable * 0.15); // 5250
    });

    it('should return 400 for missing income', async () => {
      const taxData = {
        businessExpenses: 1000
        // missing income
      };

      const response = await request(app)
        .post('/api/tax-estimator/calculate')
        .send(taxData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Income is required');
    });
  });

  // Test Case 2: Save Tax Estimate Endpoint Test
  describe('POST /api/tax-estimator/save', () => {
    it('should save tax estimate successfully', async () => {
      const estimateData = {
        userEmail: 'test@example.com',
        country: 'United States',
        state: 'California',
        status: 'Single',
        quarter: 'Q1',
        income: 60000,
        businessExpenses: 4000,
        retirement: 5000,
        healthInsurance: 3000,
        homeOffice: 2000,
        taxableIncome: 46000,
        estimatedTax: 6900,
        effectiveRate: 11.5
      };

      const response = await request(app)
        .post('/api/tax-estimator/save')
        .send(estimateData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tax estimate saved successfully');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.userEmail).toBe('test@example.com');
      expect(response.body.data.income).toBe(60000);
    });

    it('should return 400 for missing user email', async () => {
      const estimateData = {
        income: 50000
        // missing userEmail
      };

      const response = await request(app)
        .post('/api/tax-estimator/save')
        .send(estimateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User email is required');
    });

    it('should return 400 for invalid income', async () => {
      const estimateData = {
        userEmail: 'test@example.com',
        income: 0
      };

      const response = await request(app)
        .post('/api/tax-estimator/save')
        .send(estimateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Valid income is required');
    });
  });
});
