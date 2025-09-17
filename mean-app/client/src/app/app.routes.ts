import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';

export const routes: Routes = [
  // Default route - redirect to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Authentication routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  
  // Main application routes (lazy loaded for better performance)
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard)
  },
  
  // Financial management routes (lazy loaded)
  // TODO: Uncomment when components are created
  // { 
  //   path: 'income', 
  //   loadComponent: () => import('./features/income-form/income-form').then(m => m.IncomeForm)
  // },
  // { 
  //   path: 'expenses', 
  //   loadComponent: () => import('./features/expenses/expenses-form/expenses-form.component').then(m => m.ExpensesForm)
  // },
  
  // Legacy routes for backward compatibility
  { path: 'features/login', redirectTo: '/login' },
  { path: 'features/signup', redirectTo: '/signup' },
  
  // Wildcard route - redirect to login for any unknown routes
  { path: '**', redirectTo: '/login' }
];