# Initial API List - Milestone 1

**Project:** TaxPal
**Date:** September 12, 2025  
---

## 📋 Overview
This document outlines the initial API endpoints required for Milestone 1 of the TaxPal financial management application.

---

## 👤 Authentication APIs

### POST /api/auth/register
- **Description:** Create new TaxPal account
- **Authentication Required:** No
- **Request Body:**
```json
{
  "fullName": "string",
  "email": "string", 
  "username": "string",
  "password": "string",
  "confirmPassword": "string",
  "country": "string"
}
```
- **Success Response (201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "username": "string"
  },
  "token": "jwt_token_string"
}
```
- **Error Response (400):**
```json
{
  "error": "Email already exists"
}
```

### POST /api/auth/login
- **Description:** Sign in to TaxPal account
- **Authentication Required:** No
- **Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
- **Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt_token_string",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "username": "string"
  }
}
```
- **Error Response (401):**
```json
{
  "error": "Invalid username or password"
}
```

### POST /api/auth/forgot-password
- **Description:** Request password reset
- **Authentication Required:** No
- **Request Body:**
```json
{
  "email": "string"
}
```
- **Success Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

---

## 📊 Dashboard APIs

### GET /api/dashboard/summary
- **Description:** Get complete dashboard data for TaxPal
- **Authentication Required:** Yes
- **Headers:**
```
Authorization: Bearer <jwt_token>
```
- **Success Response (200):**
```json
{
  "monthlyIncome": 420.00,
  "monthlyExpenses": 0.00,
  "estimatedTaxDue": 0.00,
  "savingsRate": 100.0,
  "incomeGrowth": 17,
  "expenseGrowth": 0,
  "taxStatus": "No amount due",
  "savingsGoalProgress": 111,
  "chartData": {
    "incomeVsExpenses": [
      {
        "month": "Jan",
        "income": 5000,
        "expenses": 3000
      },
      {
        "month": "Feb", 
        "income": 4500,
        "expenses": 3200
      }
    ]
  },
  "expenseBreakdown": {
    "rentMortgage": 32,
    "businessExpenses": 28,
    "utilities": 17,
    "food": 12,
    "other": 11
  },
  "recentTransactions": [
    {
      "id": "string",
      "date": "May 9, 2025",
      "description": "Design Project",
      "category": "Consulting",
      "amount": 129.00,
      "type": "income"
    }
  ]
}
```

---

## 💰 Income Management APIs

### POST /api/transactions/income
- **Description:** Add new income record
- **Authentication Required:** Yes
- **Headers:**
```
Authorization: Bearer <jwt_token>
```
- **Request Body:**
```json
{
  "description": "string",
  "amount": 0.00,
  "category": "string",
  "date": "YYYY-MM-DD",
  "notes": "string (optional)"
}
```
- **Success Response (201):**
```json
{
  "message": "Income recorded successfully",
  "income": {
    "id": "string",
    "description": "Design Project",
    "amount": 5000,
    "category": "Consulting",
    "date": "2025-09-12",
    "notes": "Web design project for client",
    "userId": "string",
    "createdAt": "2025-09-12T10:30:00Z"
  }
}
```

### GET /api/transactions/income
- **Description:** Get all income entries for authenticated user
- **Authentication Required:** Yes
- **Headers:**
```
Authorization: Bearer <jwt_token>
```
- **Query Parameters:**
```
?limit=10&offset=0&month=2025-09
```
- **Success Response (200):**
```json
{
  "incomes": [
    {
      "id": "string",
      "description": "Design Project",
      "amount": 5000,
      "category": "Consulting",
      "date": "2025-09-12",
      "notes": "Web design project for client"
    }
  ],
  "total": 1,
  "totalAmount": 5000
}
```

---

## 💸 Expenses Management APIs

### POST /api/transactions/expense
- **Description:** Add new expense record
- **Authentication Required:** Yes
- **Headers:**
```
Authorization: Bearer <jwt_token>
```
- **Request Body:**
```json
{
  "description": "string",
  "amount": 0.00,
  "category": "string", 
  "date": "YYYY-MM-DD",
  "notes": "string (optional)"
}
```
- **Success Response (201):**
```json
{
  "message": "Expense recorded successfully",
  "expense": {
    "id": "string",
    "description": "Office supplies",
    "amount": 1200,
    "category": "Business Expenses",
    "date": "2025-09-12",
    "notes": "Monthly office supplies purchase",
    "userId": "string",
    "createdAt": "2025-09-12T10:30:00Z"
  }
}
```

### GET /api/transactions/expense
- **Description:** Get all expense entries for authenticated user
- **Authentication Required:** Yes
- **Headers:**
```
Authorization: Bearer <jwt_token>
```
- **Query Parameters:**
```
?limit=10&offset=0&month=2025-09
```
- **Success Response (200):**
```json
{
  "expenses": [
    {
      "id": "string",
      "description": "Office supplies",
      "amount": 1200,
      "category": "Business Expenses",
      "date": "2025-09-12",
      "notes": "Monthly office supplies purchase"
    }
  ],
  "total": 1,
  "totalAmount": 1200
}
```

---

## 📂 Categories APIs

### GET /api/categories
- **Description:** Get predefined categories for income and expenses
- **Authentication Required:** Yes
- **Headers:**
```
Authorization: Bearer <jwt_token>
```
- **Success Response (200):**
```json
{
  "incomeCategories": [
    "Salary",
    "Freelance", 
    "Consulting",
    "Business Revenue",
    "Investments",
    "Other"
  ],
  "expenseCategories": [
    "Rent Mortgage",
    "Business Expenses", 
    "Utilities",
    "Food",
    "Transportation",
    "Healthcare",
    "Entertainment",
    "Other"
  ]
}
