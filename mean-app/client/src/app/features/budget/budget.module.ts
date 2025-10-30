import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetFormComponent } from './budget-form/budget-form.component';

const routes: Routes = [
  { path: 'budgets', component: BudgetFormComponent },
  { path: '', redirectTo: '/budgets', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule {}