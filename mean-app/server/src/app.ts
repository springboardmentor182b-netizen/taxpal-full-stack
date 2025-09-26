import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { setupSwagger } from "./swagger";
import userRoutes from "./api/modules/user/user.routes";
import incomeRoutes from "./api/modules/income/income.routes";
import expenseRoutes from "./api/modules/expense/expense.routes";
import dashboardRoutes from "./api/modules/dashboard/dashboard.routes";
import categoriesRoutes from "./api/modules/categories/category.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(bodyParser.json());
app.use(express.json());

setupSwagger(app);

// Routes
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/user", userRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Hello from Express 🚀");
});

export default app;
