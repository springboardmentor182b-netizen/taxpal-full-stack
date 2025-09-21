import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardForm } from './dashboard-form/dashboard-form';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardForm
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // ✅ required
    FormsModule          // ✅ required for ngModel if needed
  ],
  exports: [DashboardForm]
})
export class DashboardFormModule { }
