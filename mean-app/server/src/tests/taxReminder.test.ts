// src/tests/taxReminder.test.ts
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { setupTestDb, teardownTestDb, clearTestDb } from "./setup/testDb";
import taxRemindersRoutes from "../api/modules/taxRemainders/taxReminder.routes";
import TaxReminder from "../api/modules/taxRemainders/taxReminder.model";
import { auth } from "../api/middlewares/auth";

jest.setTimeout(300000); // 5 minutes

const app = express();
app.use(express.json());

// --- Mount route with auth middleware ---
app.use("/api/v1/tax-reminders", auth, taxRemindersRoutes);

// Extend Express Request for TS
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// --- Test data ---
const TEST_USER_ID = "507f1f77bcf86cd799439011";
const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_for_testing_milestone2";
const token = jwt.sign({ id: TEST_USER_ID }, JWT_SECRET);

describe("TaxPal Backend Tests - Tax Reminder (Real Auth)", () => {
  beforeAll(async () => await setupTestDb());
  afterAll(async () => await teardownTestDb());
  beforeEach(async () => await clearTestDb());

  it("should update the reminder status with real auth", async () => {
    // Create a reminder in DB
    const reminder = await TaxReminder.create({
      user_id: TEST_USER_ID,
      quarter: "Q1 (Apr-Jun)",
      due_date: new Date("2025-06-15"),
      amount: 57000,
      status: "reminder",
    });

    const res = await request(app)
      .patch(`/api/v1/tax-reminders/${reminder._id}`) // ✅ full path
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "payment_done" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("payment_done");

    const updatedReminder = await TaxReminder.findById(reminder._id);
    expect(updatedReminder?.status).toBe("payment_done");
  });
});
