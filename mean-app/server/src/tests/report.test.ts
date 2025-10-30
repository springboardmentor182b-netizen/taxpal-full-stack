import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { setupTestDb, teardownTestDb, clearTestDb } from "./setup/testDb";
import reportRoutes from "../api/modules/reports/report.routes";
import Report from "../api/modules/reports/report.model";
import { ReportType, ReportPeriod, ReportFormat, ReportStatus } from "../api/modules/reports/report.types";

dotenv.config({ path: ".env.test" });
jest.setTimeout(300000); // 5 min timeout

const app = express();
app.use(express.json());
app.use("/api/v1/reports", reportRoutes);

const mockUserId = "507f1f77bcf86cd799439011";
const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_for_testing_milestone2";
const mockToken = jwt.sign({ id: mockUserId }, JWT_SECRET);

describe("TaxPal Backend Tests - Report Management", () => {

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
    if (global.gc) global.gc();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  afterEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  // ========== GENERATE REPORT ==========
  describe("POST /api/v1/reports/generate", () => {
    it("should create a new report successfully", async () => {
      const response = await request(app)
        .post("/api/v1/reports/generate")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          reportType: ReportType.EXPENSE_REPORT,
          period: ReportPeriod.CURRENT_MONTH,
          format: ReportFormat.PDF
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.reportType).toBe(ReportType.EXPENSE_REPORT);
      expect(response.body.data.period).toBe(ReportPeriod.CURRENT_MONTH);

      const savedReport = await Report.findById(response.body.data._id);
      expect(savedReport).toBeTruthy();
     expect(savedReport?.status).toBe(ReportStatus.COMPLETED);
    });

    it("should reject invalid report type", async () => {
      const response = await request(app)
        .post("/api/v1/reports/generate")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          reportType: "InvalidType",
          period: ReportPeriod.CURRENT_MONTH
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid report type");
    });

    it("should reject request without token", async () => {
      const response = await request(app)
        .post("/api/v1/reports/generate")
        .send({
          reportType: ReportType.EXPENSE_REPORT,
          period: ReportPeriod.CURRENT_MONTH
        });

      expect(response.status).toBe(401);
    });
  });

 
  describe("GET /api/v1/reports", () => {
    it("should return reports for the user", async () => {
      await Report.create({
        userId: mockUserId,
        reportType: ReportType.EXPENSE_REPORT,
        period: ReportPeriod.CURRENT_MONTH,
        format: ReportFormat.PDF,
        status: ReportStatus.COMPLETED
      });

      const response = await request(app)
        .get("/api/v1/reports")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0].userId).toBe(mockUserId);
    });
  });

 
  describe("GET /api/v1/reports/:id", () => {
    it("should return a report by ID", async () => {
      const report = await Report.create({
        userId: mockUserId,
        reportType: ReportType.EXPENSE_REPORT,
        period: ReportPeriod.CURRENT_MONTH,
        format: ReportFormat.PDF,
        status: ReportStatus.COMPLETED
      });

      const response = await request(app)
        .get(`/api/v1/reports/${report._id}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(report._id.toString());
    });

    it("should return 404 for invalid ID", async () => {
      const response = await request(app)
        .get(`/api/v1/reports/123`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid report ID");
    });
  });
  describe("DELETE /api/v1/reports/:id", () => {
    it("should delete a report successfully", async () => {
      const report = await Report.create({
        userId: mockUserId,
        reportType: ReportType.EXPENSE_REPORT,
        period: ReportPeriod.CURRENT_MONTH,
        format: ReportFormat.PDF,
        status: ReportStatus.COMPLETED
      });

      const response = await request(app)
        .delete(`/api/v1/reports/${report._id}`)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Report deleted successfully");

      const deleted = await Report.findById(report._id);
      expect(deleted).toBeNull();
    });
  });


  describe("GET /api/v1/reports/stats", () => {
    it("should return report statistics", async () => {
      await Report.create({
        userId: mockUserId,
        reportType: ReportType.EXPENSE_REPORT,
        period: ReportPeriod.CURRENT_MONTH,
        format: ReportFormat.PDF,
        status: ReportStatus.COMPLETED
      });

      const response = await request(app)
        .get("/api/v1/reports/stats")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.completed).toBeGreaterThanOrEqual(1);
    });
  });
});