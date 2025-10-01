import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// 1. Import Swagger dependencies (From your feature branch)
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

// Utility and Middleware Imports
import { authMiddleware } from './api/middlewares/auth.middleware.js'; // Auth Middleware

// Import your module routes
import userRoutes from './api/modules/user/user.routes.js';
import transactionRoutes from './api/modules/transactions/transaction.routes.js';
import dashboardRoutes from './api/modules/dashboard/dashboard.routes.js';
import budgetRoutes from './api/modules/budget/budget.routes.js';
import categoryRoutes from './api/modules/category/category.routes.js'; // NEW: Category Routes (From your feature branch)

dotenv.config();

// --- Configuration ---
const __dirname = path.resolve(); // Use path.resolve() for simple relative pathing

// --- Swagger Setup ---
// 2. Load the YAML file.
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

// Protected Routes (require JWT authentication) - Combining and using the authenticated approach
// Note: We use the 'authMiddleware' here to protect all subsequent routes
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/budget', authMiddleware, budgetRoutes);
app.use('/api/category', authMiddleware, categoryRoutes); // Your new, protected Category Routes

// test route
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Server is running 🚀' });
});

// IMPORTANT: Assuming you have an error handler, it should go here.
// import { errorHandler } from './api/middlewares/error.middleware.js';
// app.use(errorHandler);

export default app;
