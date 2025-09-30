import swaggerJSDoc from "swagger-jsdoc";

import * as swaggerUi from "swagger-ui-express";

import { Application } from "express";
import path from "path";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Category API",
      version: "1.0.0",
      description: "API documentation for Category management",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: [path.join(__dirname, "./Route/*.ts")],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};