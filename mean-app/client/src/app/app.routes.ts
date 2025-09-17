import { Routes } from '@angular/router';
//import { IncomeForm } from './features/income-form/income-form';
//import { ExpensesForm } from './features/expenses/expenses-form/expenses-form.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard) },
];
