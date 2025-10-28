import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { setupSwagger } from "./swagger";

import userRoutes from "./api/modules/user/user.routes";
import incomeRoutes from "./api/modules/income/income.routes";
import expenseRoutes from "./api/modules/expense/expense.routes";
import dashboardRoutes from "./api/modules/dashboard/dashboard.routes";
import categoriesRoutes from "./api/modules/categories/category.routes";
import taxEstimatorRoutes from "./api/modules/taxEstimator/taxEstimator.route";
import taxRemindersRoutes from "./api/modules/taxRemainders/taxReminder.routes";
import reportExportRoutes from "./api/modules/reportexport/reportexport.routes";
import budgetRoutes from "./api/modules/budget/budget.routes";
import reportRoutes from "./api/modules/reports/report.routes";

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: ["http://localhost:4200", "https://your-render-app.onrender.com"], // add your deployed domain here
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Swagger
setupSwagger(app);

// ✅ API Routes
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/tax-estimates", taxEstimatorRoutes);
app.use("/api/v1/tax-reminders", taxRemindersRoutes);
app.use("/api/v1/budgets", budgetRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/reportexports", reportExportRoutes);
app.use("/api/user", userRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Server running on clind side")
});

// ✅ Serve Angular build (AFTER API routes)
const clientPath = path.join(__dirname, "../../client/dist/dum/browser/browser");

app.use(express.static(clientPath));

// ✅ Handle Angular routes (for refreshing or direct links)
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

export default app;
