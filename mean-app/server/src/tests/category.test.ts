import request from "supertest";
import express from "express";
import { setupTestDb, teardownTestDb, clearTestDb } from "./setup/testDb";

import categoryRoutes from "../api/modules/categories/category.routes";
import Category from "../api/modules/categories/category.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: '.env.test' });


jest.setTimeout(300000); // 5 minutes

const app = express();
app.use(express.json());
app.use("/api/v1/categories", categoryRoutes);

const mockUserId = "507f1f77bcf86cd799439011";
const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_for_testing_milestone2";
const mockToken = jwt.sign({ id: mockUserId }, JWT_SECRET);

describe("TaxPal Backend Tests - Category Management", () => {

  beforeAll(async () => { 
    await setupTestDb(); 
  });
  
  afterAll(async () => { 
    await teardownTestDb();
    
    if (global.gc) {
      global.gc();
    }
  });
  
  beforeEach(async () => { 
    await clearTestDb(); 
  });
  
  afterEach(async () => {
    
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe("POST /api/v1/categories", () => {
    it("should create an expense category", async () => {
      const response = await request(app)
        .post("/api/v1/categories")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ name: "Marketing Expenses", type: "expense" });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe("Marketing Expenses");
      expect(response.body.data.type).toBe("expense");

      const savedCategory = await Category.findById(response.body.data._id);
      expect(savedCategory).toBeTruthy();
    });

    it("should reject without token", async () => {
      const response = await request(app)
        .post("/api/v1/categories")
        .send({ name: "Test Category", type: "expense" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("No token provided");
    });
  });

  describe("GET /api/v1/categories", () => {
    it("should return default and user categories", async () => {
      
      await Category.create({ name: "Web Dev Tools", type: "expense", createdBy: mockUserId });

      const response = await request(app)
        .get("/api/v1/categories")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.some((c: any) => c.name === "Web Dev Tools")).toBe(true);
    });
  });
});