import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./api/models/user/user.routes";
import incomeRoutes from "./api/models/income/income.routes";
import expenseRoutes from "./api/models/expense/expense.routes";
const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use("/api/user", userRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
export default app;

