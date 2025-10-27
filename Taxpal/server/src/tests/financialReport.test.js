const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const { FinancialReportModel } = require('./FinancialReport.model');
const { FinancialReportService } = require('./FinancialReport.service');

describe('Financial Reports API Comprehensive Tests', () => {
  let service;
  let testReportId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'MONGODB_URI=mongodb://localhost:27017/taxpal');
    service = new FinancialReportService();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the reports collection before each test
    await FinancialReportModel.deleteMany({});
  });

  // MODEL TESTS 
  describe('FinancialReport Model Tests', () => {
    it('should create and save a financial report successfully', async () => {
      const validReport = new FinancialReportModel({
        title: 'Monthly Income Report',
        amount: 5000.75,
        category: 'INCOME',
        date: new Date('2024-01-15')
      });

      const savedReport = await validReport.save();

      expect(savedReport._id).toBeDefined();
      expect(savedReport.title).toBe('Monthly Income Report');
      expect(savedReport.amount).toBe(5000.75);
      expect(savedReport.category).toBe('INCOME');
      expect(savedReport.date).toEqual(new Date('2024-01-15'));
    });

    it('should require title field', async () => {
      const reportWithoutTitle = new FinancialReportModel({
        amount: 1000,
        category: 'EXPENSE',
        date: new Date()
      });

      await expect(reportWithoutTitle.save()).rejects.toThrow();
    });

    it('should require amount field', async () => {
      const reportWithoutAmount = new FinancialReportModel({
        title: 'Test Report',
        category: 'INCOME',
        date: new Date()
      });

      await expect(reportWithoutAmount.save()).rejects.toThrow();
    });

    it('should require category field', async () => {
      const reportWithoutCategory = new FinancialReportModel({
        title: 'Test Report',
        amount: 1000,
        date: new Date()
      });

      await expect(reportWithoutCategory.save()).rejects.toThrow();
    });

    it('should set default date if not provided', async () => {
      const report = new FinancialReportModel({
        title: 'Default Date Test',
        amount: 2500,
        category: 'REVENUE'
      });

      const savedReport = await report.save();
      expect(savedReport.date).toBeDefined();
      expect(savedReport.date instanceof Date).toBe(true);
    });
  });

  // SERVICE TESTS 
  describe('FinancialReport Service Tests', () => {
    it('should create a new report via service', async () => {
      const reportData = {
        title: 'Service Test Report',
        amount: 3000,
        category: 'INCOME',
        date: new Date()
      };

      const result = await service.createReport(reportData);
      expect(result._id).toBeDefined();
      expect(result.title).toBe(reportData.title);
    });

    it('should return all reports via service', async () => {
      const reports = [
        { title: 'Report 1', amount: 1000, category: 'INCOME', date: new Date() },
        { title: 'Report 2', amount: 500, category: 'EXPENSE', date: new Date() }
      ];

      await FinancialReportModel.insertMany(reports);
      const result = await service.getAllReports();

      expect(result.length).toBe(2);
      expect(result[0].title).toBe('Report 1');
    });

    it('should delete an existing report via service', async () => {
      const report = await FinancialReportModel.create({
        title: 'Report to Delete',
        amount: 1000,
        category: 'INCOME',
        date: new Date()
      });

      const result = await service.deleteReport(report._id.toString());
      expect(result._id.toString()).toBe(report._id.toString());

      const deleted = await FinancialReportModel.findById(report._id);
      expect(deleted).toBeNull();
    });

    it('should throw error when deleting non-existent report via service', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await expect(service.deleteReport(fakeId)).rejects.toThrow('Report not found');
    });

    it('should generate CSV data via service', async () => {
      await FinancialReportModel.create({
        title: 'CSV Test',
        amount: 1500,
        category: 'INCOME',
        date: new Date('2024-01-01')
      });

      const csv = await service.exportCSV();
      expect(typeof csv).toBe('string');
      expect(csv).toContain('_id,title,amount,category,date');
      expect(csv).toContain('CSV Test');
    });

    it('should generate Excel buffer via service', async () => {
      await FinancialReportModel.create({
        title: 'Excel Test',
        amount: 2000,
        category: 'EXPENSE',
        date: new Date()
      });

      const buffer = await service.exportExcel();
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should throw error when no reports for export via service', async () => {
      await expect(service.exportCSV()).rejects.toThrow('No reports found');
      await expect(service.exportExcel()).rejects.toThrow('No reports found');
    });
  });

  // API ENDPOINT TESTS
  describe('POST /api/v1/financial-reports', () => {
    it('should create a new financial report', async () => {
      const reportData = {
        title: 'Test Income Report',
        amount: 1500.75,
        category: 'INCOME',
        date: new Date().toISOString()
      };

      const response = await request(app)
        .post('/api/v1/financial-reports')
        .send(reportData)
        .expect(201);

      expect(response.body.message).toBe('Report created successfully');
      expect(response.body.report.title).toBe(reportData.title);
      expect(response.body.report.amount).toBe(reportData.amount);
      
      testReportId = response.body.report._id;
    });

    it('should return 500 for invalid report data', async () => {
      const invalidData = {
        title: 'Test Report'
        // Missing required fields: amount, category
      };

      const response = await request(app)
        .post('/api/v1/financial-reports')
        .send(invalidData)
        .expect(500);

      expect(response.body.message).toBe('Error creating report');
    });
  });

  describe('GET /api/v1/financial-reports', () => {
    it('should return all financial reports', async () => {
      const reports = [
        {
          title: 'Income Report 1',
          amount: 1000,
          category: 'INCOME',
          date: new Date()
        },
        {
          title: 'Expense Report 1',
          amount: 500,
          category: 'EXPENSE',
          date: new Date()
        }
      ];

      await FinancialReportModel.insertMany(reports);

      const response = await request(app)
        .get('/api/v1/financial-reports')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('Income Report 1');
    });

    it('should return empty array when no reports exist', async () => {
      const response = await request(app)
        .get('/api/v1/financial-reports')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('DELETE /api/v1/financial-reports/:id', () => {
    it('should delete an existing report', async () => {
      const report = await FinancialReportModel.create({
        title: 'Report to Delete',
        amount: 1000,
        category: 'INCOME',
        date: new Date()
      });

      const response = await request(app)
        .delete(`/api/v1/financial-reports/${report._id}`)
        .expect(200);

      expect(response.body.message).toBe('Report deleted successfully');

      const deletedReport = await FinancialReportModel.findById(report._id);
      expect(deletedReport).toBeNull();
    });

    it('should return 500 when deleting non-existent report', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/v1/financial-reports/${fakeId}`)
        .expect(500);

      expect(response.body.message).toBe('Error deleting report');
    });
  });

  describe('GET /api/v1/financial-reports/export/csv', () => {
    it('should export reports as CSV', async () => {
      await FinancialReportModel.create({
        title: 'CSV Export Test',
        amount: 2500,
        category: 'INCOME',
        date: new Date()
      });

      const response = await request(app)
        .get('/api/v1/financial-reports/export/csv')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('financial_reports.csv');
      expect(response.text).toContain('_id,title,amount,category,date');
      expect(response.text).toContain('CSV Export Test');
    });

    it('should return 500 when no reports to export', async () => {
      const response = await request(app)
        .get('/api/v1/financial-reports/export/csv')
        .expect(500);

      expect(response.body.message).toBe('Error exporting CSV');
    });
  });

  describe('GET /api/v1/financial-reports/export/excel', () => {
    it('should export reports as Excel', async () => {
      await FinancialReportModel.create({
        title: 'Excel Export Test',
        amount: 3000,
        category: 'EXPENSE',
        date: new Date()
      });

      const response = await request(app)
        .get('/api/v1/financial-reports/export/excel')
        .expect(200);

      expect(response.headers['content-type']).toContain('spreadsheetml');
      expect(response.headers['content-disposition']).toContain('financial_reports.xlsx');
      expect(Buffer.isBuffer(response.body)).toBe(true);
    });

    it('should return 500 when no reports to export', async () => {
      const response = await request(app)
        .get('/api/v1/financial-reports/export/excel')
        .expect(500);

      expect(response.body.message).toBe('Error exporting Excel');
    });
  });

  describe('GET /api/v1/financial-reports/export/pdf', () => {
    it('should handle PDF export request', async () => {
      await FinancialReportModel.create({
        title: 'PDF Export Test',
        amount: 1500,
        category: 'INCOME',
        date: new Date()
      });

      const response = await request(app)
        .get('/api/v1/financial-reports/export/pdf')
        .expect(200);

      expect(response.body.message).toBeDefined();
      expect(response.body.reports).toBeDefined();
    });
  });

  describe('GET /api/v1/financial-reports/download/:id', () => {
    it('should download a specific report', async () => {
      const report = await FinancialReportModel.create({
        title: 'Download Test Report',
        amount: 999.99,
        category: 'ASSET',
        date: new Date()
      });

      const response = await request(app)
        .get(`/api/v1/financial-reports/download/${report._id}`)
        .expect(200);

      expect(response.body._id).toBe(report._id.toString());
      expect(response.body.title).toBe('Download Test Report');
    });

    it('should return 500 for non-existent report download', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/v1/financial-reports/download/${fakeId}`)
        .expect(500);

      expect(response.body.message).toBe('Error downloading report');
    });
  });

  // INTEGRATION TESTS
  describe('Integration Tests - Complete Flow', () => {
    it('should complete full CRUD cycle', async () => {
      // Create a report
      const createResponse = await request(app)
        .post('/api/v1/financial-reports')
        .send({
          title: 'Integration Test Report',
          amount: 5000,
          category: 'INCOME',
          date: new Date().toISOString()
        })
        .expect(201);

      const reportId = createResponse.body.report._id;

      // Verify it exists in GET all
      const getAllResponse = await request(app)
        .get('/api/v1/financial-reports')
        .expect(200);

      expect(getAllResponse.body.length).toBe(1);
      expect(getAllResponse.body[0]._id).toBe(reportId);

      // Download the report
      const downloadResponse = await request(app)
        .get(`/api/v1/financial-reports/download/${reportId}`)
        .expect(200);

      expect(downloadResponse.body._id).toBe(reportId);

      // Export as CSV
      const csvResponse = await request(app)
        .get('/api/v1/financial-reports/export/csv')
        .expect(200);

      expect(csvResponse.text).toContain('Integration Test Report');

      // Delete the report
      const deleteResponse = await request(app)
        .delete(`/api/v1/financial-reports/${reportId}`)
        .expect(200);

      expect(deleteResponse.body.message).toBe('Report deleted successfully');

      // Verify it's gone
      const finalGetResponse = await request(app)
        .get('/api/v1/financial-reports')
        .expect(200);

      expect(finalGetResponse.body.length).toBe(0);
    });
  });

  // EDGE CASE TESTS
  describe('Edge Case Tests', () => {
    it('should handle very long titles', async () => {
      const longTitle = 'A'.repeat(500);
      
      const response = await request(app)
        .post('/api/v1/financial-reports')
        .send({
          title: longTitle,
          amount: 1000,
          category: 'INCOME',
          date: new Date().toISOString()
        })
        .expect(201);

      expect(response.body.report.title).toBe(longTitle);
    });

    it('should handle negative amounts for expenses', async () => {
      const response = await request(app)
        .post('/api/v1/financial-reports')
        .send({
          title: 'Expense Report',
          amount: -500.50,
          category: 'EXPENSE',
          date: new Date().toISOString()
        })
        .expect(201);

      expect(response.body.report.amount).toBe(-500.50);
    });

    it('should handle zero amount', async () => {
      const response = await request(app)
        .post('/api/v1/financial-reports')
        .send({
          title: 'Zero Amount Report',
          amount: 0,
          category: 'INCOME',
          date: new Date().toISOString()
        })
        .expect(201);

      expect(response.body.report.amount).toBe(0);
    });

    it('should handle special characters in title', async () => {
      const specialTitle = 'Report with spéciål chàräctérs & symbols @#$%';
      
      const response = await request(app)
        .post('/api/v1/financial-reports')
        .send({
          title: specialTitle,
          amount: 1000,
          category: 'INCOME',
          date: new Date().toISOString()
        })
        .expect(201);

      expect(response.body.report.title).toBe(specialTitle);
    });
  });
});