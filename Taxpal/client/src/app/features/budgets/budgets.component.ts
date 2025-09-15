import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent {
  // Placeholder component for budget management
  // This will be implemented in Milestone 2
}
