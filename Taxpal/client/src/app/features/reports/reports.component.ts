import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExportComponent } from '../export/export.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, ExportComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  // Placeholder component for financial reports
  // This will be implemented in Milestone 4
}
