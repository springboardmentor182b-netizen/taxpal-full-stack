// src/app/features/tax-estimator/tax-estimator.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxEstimatorFormComponent } from './tax-estimator-form/tax-estimator-form.component';

const routes: Routes = [
  { path: 'tax-estimator', component: TaxEstimatorFormComponent },
  { path: '', redirectTo: '/tax-estimator', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),  // setup child routes
    TaxEstimatorFormComponent       // import standalone component
  ],
  exports: [RouterModule]
})
export class TaxEstimatorModule { }