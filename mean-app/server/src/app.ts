import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./api/modules/user/user.routes";
import incomeRoutes from "./api/modules/income/income.routes";
import expenseRoutes from "./api/modules/expense/expense.routes";
import dashboardRoutes from './api/modules/dashboard/dashboard.routes';
//import budgetModule from './api/modules/budget/budget.routes';
const app = express();

app.use(cors());
app.use(bodyParser.json());

// register routes
app.use('/api/v1/dashboard', dashboardRoutes);
//app.use('api/budget',budgetRoutes);
// simple route
app.get('/', (req, res) => {
  res.send('Hello from Express 🚀');
});
app.use("/api/user", userRoutes);
console.log("✅ /api/user routes mounted");
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);

export default app;