import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports-form/reports.component';

const routes: Routes = [
  { path: 'reports', component: ReportsComponent },
  { path: '', redirectTo: '/reports', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
