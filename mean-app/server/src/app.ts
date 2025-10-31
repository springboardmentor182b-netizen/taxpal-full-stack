import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { setupSwagger } from "./swagger";

// ✅ Import route modules
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

// =========================================================
// ✅ Express App Setup
// =========================================================
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://taxpal-full-stack1-sh9q.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================
// ✅ Swagger Setup
// =========================================================
setupSwagger(app);

// =========================================================
// ✅ API Routes
// =========================================================
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


// =========================================================
// ✅ Angular Frontend Serving Logic
// =========================================================
const clientDistBase = path.resolve(__dirname, "../../client/dist");

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
    console.log("✅ Found frontend build at:", clientPath);
  }
} catch (e) {
  console.warn("⚠️ Error while searching for frontend build:", e);
}

// =========================================================
// ✅ Serve Angular + Redirect Root to /login
// =========================================================
if (clientPath) {
  app.use(express.static(clientPath));

  // ✅ Redirect root ("/") to Angular /login route
  app.get("/", (req, res) => {
    res.redirect("/login");
  });

  // ✅ Angular routing fallback for SPA
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath!, "index.html"));
  });
} else {
  console.warn("⚠️ Frontend build not found.");
  console.warn("➡️ Run this command to build it:");
  console.warn("   cd client && ng build --configuration production");
}

// =========================================================
// ✅ Export App
// =========================================================
export default app;