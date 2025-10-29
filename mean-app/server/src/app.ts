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
      "https://taxpal-full-stack.onrender.com"
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

// ✅ Routes
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
// __dirname is server/src, go up two levels to reach mean-app/client/dist
const clientDistBase = path.resolve(__dirname, "../../client/dist");

// candidate output folders commonly produced by Angular builds in monorepos
let candidates: string[] = [];
try {
  candidates = [
    path.join(clientDistBase, "dum", "browser"),
    path.join(clientDistBase, "dum"),
    // fallback: add any directory under client/dist
    ...fs.readdirSync(clientDistBase, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => path.join(clientDistBase, d.name)),
  ];
} catch (e) {
  // clientDistBase may not exist yet
  candidates = [path.join(clientDistBase)];
}

// Recursively search for an index.html under clientDistBase and use its parent folder
let clientPath: string | null = null;
function findIndexHtml(start: string, maxDepth = 6): string | null {
  const stack: Array<{ dir: string; depth: number }> = [{ dir: start, depth: 0 }];

  while (stack.length > 0) {
    const { dir, depth } = stack.pop()!;
    if (depth > maxDepth) continue;
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      continue;
    }

    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isFile() && e.name.toLowerCase() === 'index.html') {
        return full;
      }
      if (e.isDirectory()) {
        stack.push({ dir: full, depth: depth + 1 });
      }
    }
  }
  return null;
}

try {
  const found = findIndexHtml(clientDistBase, 8);
  if (found) {
    clientPath = path.dirname(found);
    console.log('Found index.html at', found);
  }
} catch (e) {
  // ignore
}

if (!clientPath) {
  console.warn('Frontend build not found. Looked in candidates:', candidates);
  console.warn(
    "Run 'cd client && ng build --configuration production' and ensure the built files are present under client/dist/<project-name>"
  );
} else {
  console.log('Serving static files from:', clientPath);
  app.use(express.static(clientPath));

  // For Angular routing (refresh issue fix)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath!, 'index.html'));
  });
}

export default app;