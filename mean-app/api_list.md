# 📑 API List

This document lists all available API endpoints for your backend.

## 👤 User Routes

**Base URL:** `/api/user`

| Method | Endpoint | Auth Required | Description | Request Body Example |
|--------|----------|---------------|-------------|---------------------|
| POST | `/register` | ❌ | Register a new user | ```json<br>{ <br>  "fullName": "John Doe", <br>  "email": "john@example.com", <br>  "username": "john123", <br>  "password": "mypassword", <br>  "confirmPassword": "mypassword", <br>  "country": "India" <br>}<br>``` |
| POST | `/login` | ❌ | Login existing user | ```json<br>{ <br>  "email": "john@example.com", <br>  "password": "mypassword" <br>}<br>``` |
| POST | `/forgot-password` | ❌ | Request password reset link | ```json<br>{ <br>  "email": "john@example.com" <br>}<br>``` |
| POST | `/request-reset` | ❌ | Send password reset email | ```json<br>{ <br>  "email": "john@example.com" <br>}<br>``` |
| POST | `/reset-password/:token` | ❌ | Reset password using token | ```json<br>{ <br>  "newPassword": "NewPassword123", <br>  "confirmPassword": "NewPassword123" <br>}<br>``` |

## 📊 Dashboard Routes

**Base URL:** `/api/v1/dashboard`

| Method | Endpoint | Auth Required | Description | Request Body Example |
|--------|----------|---------------|-------------|---------------------|
| GET | `/:id` | ✅ (Bearer Token) | Get dashboard details by user ID | No body required |
| POST | `/` | ✅ (Bearer Token) | Create a new dashboard entry | ```json<br>{ <br>  "monthlyIncome": 5000, <br>  "monthlyExpenses": 2000, <br>  "estimatedTaxDue": 300, <br>  "savingsRate": 60 <br>}<br>``` |

## 💰 Income Routes

**Base URL:** `/api/income`

| Method | Endpoint | Auth Required | Description | Request Body Example |
|--------|----------|---------------|-------------|---------------------|
| POST | `/` | ✅ (Bearer Token) | Create new income entry | ```json<br>{ <br>  "description": "Freelance project", <br>  "amount": 5000, <br>  "category": "Work", <br>  "date": "2025-09-16", <br>  "notes": "Payment received" <br>}<br>``` |

## 💸 Expense Routes

**Base URL:** `/api/expense`

| Method | Endpoint | Auth Required | Description | Request Body Example |
|--------|----------|---------------|-------------|---------------------|
| POST | `/` | ✅ (Bearer Token) | Create new expense entry | ```json<br>{ <br>  "description": "Groceries", <br>  "amount": 1200, <br>  "category": "Food", <br>  "date": "2025-09-16", <br>  "notes": "Bought veggies and fruits" <br>}<br>``` |

---

