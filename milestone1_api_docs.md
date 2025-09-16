# TaxPal Milestone 1 API Documentation

## Overview

**Project:** TaxPal - Personal Finance & Tax Estimator for Freelancers

**Milestone 1:** Transaction Logging (Weeks 1-2)

**Purpose:**  
Enable users to register, login, and log income/expenses with a basic dashboard.

---

## Table of Contents

- [Authentication APIs](#authentication-apis)
- [User APIs](#user-apis)
- [Transaction APIs](#transaction-apis)
- [Dashboard APIs](#dashboard-apis)

---

## Authentication APIs

### 1.1 User Registration

**Endpoint:** `POST /api/auth/register`  
**Description:** Registers a new user.

**Request Body:**
```json
{
  "name": "User1",
  "email": "user@example.com",
  "password": "Password123",
  "country": "India",
  "income_bracket": "middle"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "User1",
  "email": "user@example.com",
  "country": "India",
  "income_bracket": "middle"
}
```

---

### 1.2 User Login

**Endpoint:** `POST /api/auth/login`  
**Description:** Authenticates user credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "token": "<JWT Access Token>",
  "refreshToken": "<Refresh Token>",
  "user": {
    "id": 1,
    "name": "User1",
    "email": "user@example.com",
    "country": "India",
    "income_bracket": "middle"
  }
}
```

---

### 1.3 Logout

**Endpoint:** `POST /api/auth/logout`  
**Description:** Invalidates the refresh token.

**Request Body:**
```json
{
  "refreshToken": "<Refresh Token>"
}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### 1.4 Token Refresh

**Endpoint:** `POST /api/auth/refresh-token`  
**Description:** Generates a new access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "<Refresh Token>"
}
```

**Response:**
```json
{
  "token": "<New JWT Access Token>",
  "refreshToken": "<New Refresh Token>"
}
```

---

### 1.5 Password Reset Request (Optional)

**Endpoint:** `POST /api/auth/password-reset-request`  
**Description:** Sends a password reset email to the user.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent"
}
```

---

### 1.6 Password Reset (Optional)

**Endpoint:** `POST /api/auth/password-reset`  
**Description:** Resets user password using a token.

**Request Body:**
```json
{
  "token": "<Reset Token>",
  "newPassword": "newPassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

---

## User APIs

### 2.1 Get Current User Profile

**Endpoint:** `GET /api/users/me`  
**Description:** Fetches profile info of logged-in user.

**Headers:**  
`Authorization: Bearer <JWT>`

**Response:**
```json
{
  "id": 1,
  "name": "User1",
  "email": "user@example.com",
  "country": "India",
  "income_bracket": "middle"
}
```

---

## Transaction APIs

### 3.1 Add Transaction

**Endpoint:** `POST /api/transactions`  
**Description:** Log a new income or expense.

**Headers:**  
`Authorization: Bearer <JWT>`

**Request Body:**
```json
{
  "type": "income",
  "category": "salary",
  "amount": 5000,
  "date": "2025-09-16"
}
```

**Response:**
```json
{
  "id": 101,
  "user_id": 1,
  "type": "income",
  "category": "salary",
  "amount": 5000,
  "date": "2025-09-16"
}
```

---

### 3.2 Get All Transactions

**Endpoint:** `GET /api/transactions`  
**Description:** Fetch all transactions for the logged-in user.

**Headers:**  
`Authorization: Bearer <JWT>`

**Query Parameters:** Optional `type`, `startDate`, `endDate`

**Response:**
```json
[
  { "id": 101, "type": "income", "category": "salary", "amount": 5000, "date": "2025-09-16" },
  { "id": 102, "type": "expense", "category": "groceries", "amount": 100, "date": "2025-09-16" }
]
```

---

### 3.3 Get Single Transaction

**Endpoint:** `GET /api/transactions/:id`  
**Description:** Fetch details of a specific transaction.

**Headers:**  
`Authorization: Bearer <JWT>`

**Response:**
```json
{
  "id": 101,
  "type": "income",
  "category": "salary",
  "amount": 5000,
  "date": "2025-09-16"
}
```

---

### 3.4 Update Transaction

**Endpoint:** `PUT /api/transactions/:id`  
**Description:** Update transaction details.

**Headers:**  
`Authorization: Bearer <JWT>`

**Request Body:** Any of `type`, `category`, `amount`, `date`

**Response:**
```json
{
  "id": 101,
  "type": "expense",
  "category": "rent",
  "amount": 500,
  "date": "2025-09-16"
}
```

---

### 3.5 Delete Transaction

**Endpoint:** `DELETE /api/transactions/:id`  
**Description:** Deletes a transaction.

**Headers:**  
`Authorization: Bearer <JWT>`

**Response:**
```json
{
  "message": "Transaction deleted successfully"
}
```

---

## Dashboard APIs

### 4.1 Get Dashboard Summary

**Endpoint:** `GET /api/dashboard`  
**Description:** Returns summary of income, expenses, and net balance.

**Headers:**  
`Authorization: Bearer <JWT>`

**Query Parameters:** Optional `period = daily | weekly | monthly`

**Response:**
```json
{
  "totalIncome": 5000,
  "totalExpenses": 1200,
  "netBalance": 3800
}
```

---

## Notes

- All `/transactions` and `/dashboard` endpoints require JWT authentication.
- Refresh token endpoints are required for maintaining user session.
- Password reset endpoints are optional but recommended for Milestone 1.

**End of Milestone 1 API Documentation**
