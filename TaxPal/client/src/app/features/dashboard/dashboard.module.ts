import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [CommonModule, DashboardComponent], // Import the standalone component here
  exports: [DashboardComponent]
})
export class DashboardModule {}