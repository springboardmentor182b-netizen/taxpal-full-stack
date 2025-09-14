import { Routes } from '@angular/router';
import { IncomeForm } from './features/income-form/income-form';
//import { ExpensesForm } from './features/expenses/expenses-form/expenses-form.component';

export const routes: Routes = [
  { path: 'income', loadComponent: () => import('./features/income-form/income-form').then(m => m.IncomeForm) },
  { path: 'expenses', loadComponent: () => import('./features/expenses-form/expenses-form').then(m => m.ExpensesForm) },
  { path: '', redirectTo: 'income', pathMatch: 'full' }
];
