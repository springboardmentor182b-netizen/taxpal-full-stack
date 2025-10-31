// ---------- 1) Load .env BEFORE anything else ----------
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load .env from common locations
const candidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env"),
];

let loaded = false;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    console.log("[env] loaded:", p);
    loaded = true;
    break;
  }
}
if (!loaded) console.warn("[env] .env not found; tried:", candidates);

// ---------- 2) Imports that rely on env ----------
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { setupSwagger } from "./swagger"; // ✅ Swagger integration
import { verifyMailer } from "./utils/mailer";

// ---------- 3) Initialize App ----------
const app = express();
const PORT = Number(process.env.PORT || 5000);

// ---------- 4) CORS ----------
const corsOrigins =
  process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) || [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
  ];
app.use(cors({ origin: corsOrigins, credentials: true }));

// ---------- 5) Core Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

// ---------- 6) Setup Swagger ----------
setupSwagger(app);
console.log("📘 Swagger UI running at: http://localhost:5000/api-docs");

// ---------- 7) Database Connection ----------
const mongoUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/taxpal";

console.log("[db] Connecting to:", mongoUri);
mongoose
  .connect(mongoUri)
  .then(() => console.log("[db] ✅ Connected to MongoDB"))
  .catch((err) => console.error("[db] ❌ Connection error:", err));

// ---------- 8) Import All Routes ----------
import authRoutes from "./api/auth/auth.routes";
import incomeRoutes from "./api/income/income.routes";
import expenseRoutes from "./api/expense/expense.routes";
import dashboardRoutes from "./api/dashboard/dashboard-routes";
import budgetsRoutes from "./api/budget/budget.routes";
import transactionRoutes from "./api/transaction/transaction.routes";
import categoriesRoutes from "./api/Categories/category.routes";
import taxRoutes from "./api/TaxEstimator/TaxEstimator.routes";
import financialReportsRoutes from "./api/FinancialReport/FinancialReport.routes";
import exportRoutes from "./api/ExportDownload/ExportDownload.routes";

// ---------- 9) Mount Routes ----------
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/incomes", incomeRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/budgets", budgetsRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/tax", taxRoutes);
app.use("/api/v1/financial-reports", financialReportsRoutes);
app.use("/api/v1/export", exportRoutes);

// ---------- 10) Health Check ----------
app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "OK", message: "TaxPal API is running 🚀" });
});

// ---------- 11) Route Inspector (DEV ONLY) ----------
app.get("/__routes", (_req, res) => {
  const stack: any[] = (app as any)._router?.stack || [];
  const routes: string[] = [];

  stack.forEach((l: any) => {
    if (l.name === "router" && l.handle?.stack) {
      const prefix =
        l.regexp
          ?.toString()
          .replace(/^\/\^\\/, "/")
          .replace(/\\\/\?\(\?\=\/\|\$\)\/i$/, "") || "";
      l.handle.stack.forEach((s: any) => {
        if (s.route) {
          const methods = Object.keys(s.route.methods)
            .join(",")
            .toUpperCase();
          routes.push(`${methods} ${prefix}${s.route.path}`);
        }
      });
    } else if (l.route && l.route.path) {
      const methods = Object.keys(l.route.methods).join(",").toUpperCase();
      routes.push(`${methods} ${l.route.path}`);
    }
  });

  res.json({ routes });
});

// ---------- 12) Start Server ----------
if (!(global as any).__taxpal_server_started) {
  const server = app.listen(PORT, () => {
    (global as any).__taxpal_server_started = true;
    console.log(`🚀 TaxPal server running at http://localhost:${PORT}`);
    try {
      verifyMailer();
    } catch (e) {
      console.warn("[mailer] verify skipped/failed:", (e as Error)?.message);
    }
  });

  const shutdown = () => server.close(() => process.exit(0));
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
} else {
  console.log("[server] listen skipped (already started)");
}

export default app;
