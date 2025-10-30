const {
  calculateTaxEstimate,
  saveTaxEstimate,
  getTaxEstimatesByUserId
} = require('../src/apis/Taxestimator/taxestimate.service');

describe('Tax Estimate Service', () => {
  describe('calculateTaxEstimate', () => {
    it('should calculate tax estimate correctly with all deductions', async () => {
      const taxData = {
        income: 100000,
        businessExpenses: 10000,
        retirement: 5000,
        healthInsurance: 3000,
        homeOffice: 2000
      };

      const result = await calculateTaxEstimate(taxData);

      expect(result.success).toBe(true);
      expect(result.taxableIncome).toBe(80000); // 100000 - 20000
      expect(result.estimatedTax).toBe(12000); // 80000 * 0.15
      expect(result.totalDeductions).toBe(20000);
      expect(result.effectiveTaxRate).toBe(12); // (12000 / 100000) * 100
    });

    it('should handle zero income', async () => {
      const taxData = {
        income: 0,
        businessExpenses: 1000,
        retirement: 0,
        healthInsurance: 0,
        homeOffice: 0
      };

      const result = await calculateTaxEstimate(taxData);

      expect(result.success).toBe(true);
      expect(result.taxableIncome).toBe(0);
      expect(result.estimatedTax).toBe(0);
      expect(result.totalDeductions).toBe(1000);
      expect(result.effectiveTaxRate).toBe(0);
    });

    it('should handle negative taxable income (deductions > income)', async () => {
      const taxData = {
        income: 5000,
        businessExpenses: 10000,
        retirement: 0,
        healthInsurance: 0,
        homeOffice: 0
      };

      const result = await calculateTaxEstimate(taxData);

      expect(result.success).toBe(true);
      expect(result.taxableIncome).toBe(0); // Math.max(0, 5000 - 10000)
      expect(result.estimatedTax).toBe(0);
      expect(result.totalDeductions).toBe(10000);
      expect(result.effectiveTaxRate).toBe(0);
    });

    it('should handle missing fields (default to 0)', async () => {
      const taxData = {
        income: 50000
        // missing other fields
      };

      const result = await calculateTaxEstimate(taxData);

      expect(result.success).toBe(true);
      expect(result.taxableIncome).toBe(50000);
      expect(result.estimatedTax).toBe(7500); // 50000 * 0.15
      expect(result.totalDeductions).toBe(0);
      expect(result.effectiveTaxRate).toBe(15);
    });

    it('should handle string inputs (parseFloat)', async () => {
      const taxData = {
        income: '60000',
        businessExpenses: '5000',
        retirement: '0',
        healthInsurance: '0',
        homeOffice: '0'
      };

      const result = await calculateTaxEstimate(taxData);

      expect(result.success).toBe(true);
      expect(result.taxableIncome).toBe(55000);
      expect(result.estimatedTax).toBe(8250); // 55000 * 0.15
    });
  });

  describe('saveTaxEstimate', () => {
    it('should save tax estimate and return with id and createdAt', async () => {
      const estimateData = {
        userId: 'user123',
        income: 75000,
        businessExpenses: 5000,
        retirement: 6000,
        healthInsurance: 4000,
        homeOffice: 1200
      };

      const result = await saveTaxEstimate(estimateData);

      expect(result).toMatchObject(estimateData);
      expect(result._id).toMatch(/^estimate_\d+$/);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should handle empty estimate data', async () => {
      const estimateData = {};

      const result = await saveTaxEstimate(estimateData);

      expect(result).toMatchObject(estimateData);
      expect(result._id).toMatch(/^estimate_\d+$/);
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getTaxEstimatesByUserId', () => {
    it('should return tax estimates for a user', async () => {
      const userId = 'user456';

      const result = await getTaxEstimatesByUserId(userId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].userId).toBe(userId);
      expect(result[0]).toHaveProperty('_id');
      expect(result[0]).toHaveProperty('income');
      expect(result[0]).toHaveProperty('businessExpenses');
      expect(result[0]).toHaveProperty('retirement');
      expect(result[0]).toHaveProperty('healthInsurance');
      expect(result[0]).toHaveProperty('homeOffice');
      expect(result[0]).toHaveProperty('taxableIncome');
      expect(result[0]).toHaveProperty('estimatedTax');
      expect(result[0]).toHaveProperty('createdAt');
    });

    it('should return mock data with correct structure', async () => {
      const userId = 'testUser';

      const result = await getTaxEstimatesByUserId(userId);

      expect(result[0]).toEqual({
        _id: 'estimate_001',
        userId: 'testUser',
        income: 75000,
        businessExpenses: 5000,
        retirement: 6000,
        healthInsurance: 4000,
        homeOffice: 1200,
        taxableIncome: 58800,
        estimatedTax: 8820,
        createdAt: expect.any(Date)
      });
    });
  });
});
