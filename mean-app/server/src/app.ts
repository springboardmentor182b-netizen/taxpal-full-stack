import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// 1. Import Swagger dependencies
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// Utility and Middleware Imports
import { authMiddleware } from './api/middlewares/auth.middleware.js'; // NEW: Auth Middleware

// Import your module routes
import userRoutes from './api/modules/user/user.routes.js';
import transactionRoutes from './api/modules/transactions/transaction.routes.js';
import dashboardRoutes from './api/modules/dashboard/dashboard.routes.js';
import budgetRoutes from './api/modules/budget/budget.routes.js';
import categoryRoutes from './api/modules/category/category.routes.js'; // NEW: Category Routes

dotenv.config();

// --- Configuration ---
// Note: __dirname is not available when using 'type: module'. Using fileURLToPath/path.dirname is the modern fix, 
// but since this is a simple setup, we'll ensure `path.join` works relative to the app.ts location.
const __dirname = path.resolve(); // Use path.resolve() if __dirname is undefined in module context for simple relative pathing (if necessary)

// --- Swagger Setup ---
// 2. Load the YAML file. We use path.join and '..' to go up one level from src/ to server/
const swaggerDocument = YAML.load(path.join(__dirname, 'mean-app', 'server', 'docs', 'swagger.yaml'));

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

// --- API Documentation Route ---
// Serve the interactive documentation at the /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- API Routes ---

// Public Routes (Authentication)
app.use('/api/auth', userRoutes);

// Protected Routes (require JWT authentication)
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/budget', authMiddleware, budgetRoutes);
app.use('/api/category', authMiddleware, categoryRoutes); // NEW: Protected Category Routes

// test route
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running 🚀' });
});

// IMPORTANT: Assuming you have an error handler, it should go here.
// import { errorHandler } from './api/middlewares/error.middleware.js';
// app.use(errorHandler);

export default app;
