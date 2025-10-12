import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { setupTestDb, teardownTestDb, clearTestDb } from "./setup/testDb";
import taxEstimatorRoutes from "../api/modules/taxEstimator/taxEstimator.route";
import TaxEstimate from "../api/modules/taxEstimator/taxEstimator.model";
import { auth } from "../api/middlewares/auth";

jest.setTimeout(300000); // 5 minutes

const TEST_USER_ID = "507f1f77bcf86cd799439011";
const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_for_testing_milestone2";
const token = jwt.sign({ id: TEST_USER_ID }, JWT_SECRET);

const app = express();
app.use(express.json());
app.use("/api/v1/tax-estimates", auth, taxEstimatorRoutes);

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

describe("TaxPal Backend Tests - Tax Estimator (Real Auth)", () => {
  beforeAll(async () => await setupTestDb());
  afterAll(async () => await teardownTestDb());
  beforeEach(async () => await clearTestDb());

  it("should create a new tax estimate with real auth", async () => {
    const res = await request(app)
      .post("/api/v1/tax-estimates")
      .set("Authorization", `Bearer ${token}`)
      .send({
        country: "India",
        state: "Telangana",
        quarter: "Q1 (Jan-Mar)",
        filing_status: "single",
        gross_income_for_quarter: 100000,
        business_expenses: 0,
        retirement_contribution: 0,
        health_insurance_premiums: 0,
        home_office_deduction: 0
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");  // <-- changed
    expect(res.body.user_id).toBe(TEST_USER_ID);

    const savedEstimate = await TaxEstimate.findById(res.body._id);
    expect(savedEstimate).toBeTruthy();
    expect(savedEstimate?.user_id.toString()).toBe(TEST_USER_ID);
  });
});
