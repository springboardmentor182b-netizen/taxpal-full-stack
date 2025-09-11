

---

# TaxPal – Personal Finance & Tax Estimator for Freelancers

TaxPal is a MEAN-stack web application that helps freelancers and gig workers manage income, track expenses, set budgets, and estimate quarterly taxes. It provides a responsive dashboard, tax alerts, and exportable financial reports.

---

## 📑 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Database Schema](#database-schema)
5. [Installation](#installation)
6. [Usage](#usage)
7. [License](#license)

---

## 🚀 Features

* **Authentication & Security**

  * JWT-based login and signup
  * Encrypted password storage
  * Profile & settings management

* **Income & Expense Tracking**

  * Add, edit, delete transactions
  * Categorize income/expenses
  * Dashboard transaction history

* **Budgeting & Categorization**

  * Create custom categories
  * Set monthly budgets per category
  * Visual spending breakdown (charts & progress bars)

* **Tax Estimation**

  * Regional tax calculation based on slabs
  * Quarterly breakdown & due date alerts
  * Calendar view with reminders

* **Reporting & Exporting**

  * Monthly/quarterly summaries
  * PDF/CSV export of reports
  * Detailed & summary views

* **Responsive Design**

  * Optimized for desktop, tablet, and mobile
  * Sidebar collapses to bottom navigation on mobile

---

## 🛠 Tech Stack

* **Frontend:** Angular (TypeScript, RxJS, NgRx), TailwindCSS
* **Backend:** Node.js + Express.js
* **Database:** MongoDB (Mongoose ORM)
* **Authentication:** JSON Web Tokens (JWT), bcrypt for password hashing
* **Charts:** Chart.js / Recharts
* **Exporting:** jsPDF, PapaParse

---

## 📂 Folder Structure

### Root

```
mean-app/
├── client/                 # Angular Frontend
├── server/                 # Node + Express Backend
├── config/                 # Global configs (env, DB, etc.)
├── scripts/                # Deployment or automation scripts
├── docs/                   # Documentation, API specs
├── .env                    # Environment variables
├── package.json            # Root-level scripts for convenience
└── README.md
```

### Client (Angular)

```
client/
├── src/
│   ├── app/
│   │   ├── core/            # Core services (auth, guards, interceptors)
│   │   ├── shared/          # Shared components, pipes, directives
│   │   ├── features/        # Feature modules (dashboard, budget, tax, reports)
│   │   ├── layouts/         # Layouts (admin, public, auth)
│   │   ├── state/           # NgRx store, actions, reducers, effects
│   │   └── app.module.ts
│   ├── assets/              # Images, styles, translations
│   ├── environments/        # environment.ts, environment.prod.ts
│   └── index.html
├── angular.json
└── package.json
```

### Server (Node + Express)

```
server/
├── controllers/             # Request handlers
├── models/                  # Mongoose models
├── routes/                  # API routes
├── middlewares/             # Auth, error handling
├── utils/                   # Helpers, formatters
├── server.js                # App entry point
└── package.json
```

---

## 🗄 Database Schema

### Users

| Field           | Type   | Description           |
| --------------- | ------ | --------------------- |
| id              | String | Unique identifier     |
| name            | String | Full name             |
| email           | String | User email (unique)   |
| password        | String | Encrypted password    |
| country         | String | Country for tax rules |
| income\_bracket | String | Low / Middle / High   |

### Transactions

| Field    | Type   | Description             |
| -------- | ------ | ----------------------- |
| id       | String | Unique identifier       |
| user\_id | String | FK → Users.id           |
| type     | String | income / expense        |
| category | String | e.g. food, rent, salary |
| amount   | Number | Transaction amount      |
| date     | Date   | Transaction date        |

### Budgets

| Field    | Type   | Description       |
| -------- | ------ | ----------------- |
| id       | String | Unique identifier |
| user\_id | String | FK → Users.id     |
| category | String | Budget category   |
| limit    | Number | Spending limit    |
| month    | String | Applicable month  |

### TaxEstimates

| Field          | Type   | Description       |
| -------------- | ------ | ----------------- |
| id             | String | Unique identifier |
| user\_id       | String | FK → Users.id     |
| quarter        | String | Q1, Q2, Q3, Q4    |
| estimated\_tax | Number | Tax estimate      |

### Reports

| Field        | Type   | Description              |
| ------------ | ------ | ------------------------ |
| id           | String | Unique identifier        |
| user\_id     | String | FK → Users.id            |
| period       | String | e.g. Jan 2025, Q2 2024   |
| report\_type | String | summary / detailed / tax |
| file\_path   | String | File storage path        |

---

## ⚙️ Installation

```bash
# Clone repository
git clone https://github.com/your-username/taxpal.git
cd taxpal

# Install server dependencies
cd server && npm install

# Install client dependencies
cd client && npm install

# Start backend
npm start

# Start frontend
npm start
```

---

## 🎯 Usage

* Log in or register
* Add income & expense transactions
* Create budgets & track spending visually
* Estimate taxes & get reminders
* Export reports for filing

---

## 📜 License

This project is for educational and development purposes.

---

