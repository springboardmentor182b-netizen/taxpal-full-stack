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
            _id: {
              type: "string",
              description: "Auto-generated unique ID for the transaction",
            },
            userId: {
              type: "string",
              description: "Reference to the User who owns this transaction",
            },
            type: {
              type: "string",
              enum: ["income", "expense"],
              description: "Whether this transaction is an income or expense",
            },
            amount: {
              type: "number",
              description: "The transaction amount",
            },
            category: {
              type: "string",
              description: "The category of the transaction (e.g., food, salary)",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "The date of the transaction",
            },
            description: {
              type: "string",
              description: "Short description of the transaction",
            },
            notes: {
              type: "string",
              description: "Optional notes about the transaction",
            },
          },
        },
      },
    },
  },
  apis: ["./src/apis/**/*.js"], // docs live in route files
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger docs available at /api-docs");
}

module.exports = swaggerDocs;
