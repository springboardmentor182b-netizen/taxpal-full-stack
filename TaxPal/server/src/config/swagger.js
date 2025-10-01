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
      },
    },
  },
  apis: ["./src/apis/budget/*.route.js"], // docs live in route files
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger docs available at /api-docs");
}

module.exports = swaggerDocs;
