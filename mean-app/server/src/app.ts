import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import { setupSwagger } from './swagger'
import bodyParser from "body-parser";
import userRoutes from "./api/modules/user/user.routes";
import incomeRoutes from "./api/modules/income/income.routes";
import expenseRoutes from "./api/modules/expense/expense.routes";
import dashboardRoutes from './api/modules/dashboard/dashboard.routes';
const app = express();

app.use(cors());
// Updated CORS configuration
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(bodyParser.json());
app.use(express.json());
setupSwagger(app);
// register routes
app.use('/api/v1/dashboard', dashboardRoutes);

// simple route
app.get('/', (req, res) => {
  res.send('Hello from Express 🚀');
});
app.use("/api/user", userRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
export default app;