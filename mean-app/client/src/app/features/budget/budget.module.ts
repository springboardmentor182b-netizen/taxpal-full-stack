
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetFormComponent } from './budget-form/budget-form.component';

const routes: Routes = [
  { path: 'budgets', component: BudgetFormComponent }, // route to Budgets UI
  { path: '', redirectTo: '/budgets', pathMatch: 'full' } // default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] // ✅ just export RouterModule once
})
export class AppRoutingModule {}
