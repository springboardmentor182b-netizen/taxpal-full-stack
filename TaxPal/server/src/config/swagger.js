const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaxPal API",
      version: "1.0.0",
      description: "API documentation for TaxPal project",
    },
    servers: [
      {
        url: "http://localhost:5000", // adjust if deployed
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Budget: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user_id: { type: "string" },
            category: { type: "string" },
            limit: { type: "number" },
            month: { type: "string", example: "2025-09" },
          },
          required: ["user_id", "category", "limit", "month"],
        },
        Transaction: {
          type: "object",
          required: ["userId", "type", "amount", "category", "date", "description"],
          properties: {
            _id: { type: "string", description: "Auto-generated unique ID" },
            userId: { type: "string", description: "Reference to the User" },
            type: { type: "string", enum: ["income", "expense"] },
            amount: { type: "number" },
            category: { type: "string" },
            date: { type: "string", format: "date-time" },
            description: { type: "string" },
            notes: { type: "string" },
          },
        },
        User: {
          type: "object",
          required: ["name", "email", "password", "country"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "mySecurePassword" },
            country: { type: "string", example: "India" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "mySecurePassword" },
          },
        },
      },
    },
  },
  apis: ["./src/apis/**/*.js"], // Swagger will read docs from route files
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger docs available at /api-docs");
}

module.exports = swaggerDocs;
