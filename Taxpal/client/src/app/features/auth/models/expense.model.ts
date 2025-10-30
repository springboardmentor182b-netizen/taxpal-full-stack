// src/app/features/auth/models/expense.model.ts

export interface Expense {
  _id?: string;
  userId?: string;
  description: string;
  amount: number;
  category: 'food' | 'transport' | 'shopping' | 'entertainment' | 'bills' | 'healthcare' | 'other' | string;
  date: string;          // yyyy-mm-dd ISO date
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
