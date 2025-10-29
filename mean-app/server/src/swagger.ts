// backend/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "MENA Project API", version: "1.0.0", description: "API docs" },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } }
    },
    security: [],
  },
  apis: ["./src/api/modules/**/*.ts"], // <- catch all TS routes
};
const swaggerSpec = swaggerJSDoc(options);

// Function to set up swagger in Express app
export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};