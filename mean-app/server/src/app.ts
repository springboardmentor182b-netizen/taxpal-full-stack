import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
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

// ✅ Core setup
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://taxpal-full-stack.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Swagger setup
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
  res.send("🚀 Server running successfully!");
});

// ✅ Serve Angular frontend (robust lookup)
const clientDistBase = path.resolve(__dirname, "../../client/dist");

// Try to locate the built Angular index.html dynamically
function findIndexHtml(start: string, maxDepth = 6): string | null {
  const stack: Array<{ dir: string; depth: number }> = [{ dir: start, depth: 0 }];

  while (stack.length > 0) {
    const { dir, depth } = stack.pop()!;
    if (depth > maxDepth) continue;
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isFile() && entry.name.toLowerCase() === "index.html") {
        return full;
      }
      if (entry.isDirectory()) {
        stack.push({ dir: full, depth: depth + 1 });
      }
    }
  }
  return null;
}

let clientPath: string | null = null;
try {
  const found = findIndexHtml(clientDistBase, 8);
  if (found) {
    clientPath = path.dirname(found);
    console.log("✅ Found Angular index.html at:", found);
  }
} catch {
  console.warn("⚠️ Could not find built frontend files.");
}

if (clientPath) {
  app.use(express.static(clientPath));

  // For Angular routing (handle refresh URLs)
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath!, "index.html"));
  });
} else {
  console.warn(
    "⚠️ Frontend build not found. Run 'cd client && ng build --configuration production' to build it."
  );
}

export default app;
