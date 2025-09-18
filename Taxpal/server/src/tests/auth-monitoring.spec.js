const request = require("supertest");
const app = require("../app");

describe("Auth Monitoring & Security", () => {
  it("should log an event for invalid login attempt", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({ email: "wrong@mail.com", password: "badpass" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should return a token for valid login", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({ email: "admin@mail.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject login if email format is invalid", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({ email: "notAnEmail", password: "123456" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid email format");
  });

  it("should detect multiple failed attempts as abnormal traffic", async () => {
    for (let i = 0; i < 3; i++) {
      await request(app).post("/api/v1/login").send({
        email: "wrong@mail.com",
        password: "badpass"
      });
    }

    const res = await request(app).post("/api/v1/login").send({
      email: "wrong@mail.com",
      password: "badpass"
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials - multiple failed attempts detected");
  });
});
