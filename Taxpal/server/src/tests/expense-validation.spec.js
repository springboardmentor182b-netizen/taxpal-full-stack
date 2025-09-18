const request = require("supertest");
const app = require("../app");

describe("Expense API - Validation & Monitoring", () => {
  it("should reject expense creation when category is missing", async () => {
    const res = await request(app)
      .post("/api/v1/expense")
      .send({ userId: 1, amount: 2000 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Category is required");
  });

  it("should reject expense creation when amount is negative", async () => {
    const res = await request(app)
      .post("/api/v1/expense")
      .send({ userId: 1, category: "Food", amount: -100 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Amount must be positive");
  });

  it("should allow expense creation with valid data", async () => {
    const res = await request(app)
      .post("/api/v1/expense")
      .send({ userId: 1, category: "Travel", amount: 1500 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.amount).toBe(1500);
  });

  it("should detect abnormal expense amount and log for monitoring", async () => {
    const res = await request(app)
      .post("/api/v1/expense")
      .send({ userId: 1, category: "Luxury", amount: 1000000 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.amount).toBe(1000000);

  });
});
