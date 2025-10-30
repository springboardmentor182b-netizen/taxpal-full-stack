// src/app/features/auth/models/income.model.ts

export interface Income {
  _id?: string;
  userId?: string;
  description: string;   // e.g. "Salary", "Freelance project", etc.
  amount: number;
  category: 'salary' | 'freelance' | 'business' | 'investment' | 'bonus' | 'gift' | 'other' | string;
  date: string;          // yyyy-mm-dd ISO date
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
