import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  userId: string = '';
  dashboardId: string = ''; // NEW: store actual dashboard ID
  loading: boolean = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Get current user ID
    const currentUser =
      sessionStorage.getItem('current_user') ||
      localStorage.getItem('current_user');
    if (!currentUser) return console.error('No user logged in.');
    this.userId = JSON.parse(currentUser).id;

    // Ensure dashboard exists and load transactions
    this.ensureDashboardAndLoad();
  }

  private ensureDashboardAndLoad(): void {
    // This will create or update dashboard if needed
    this.dashboardService.updateDashboard(this.userId, {}).subscribe({
      next: (dashboard) => {
        this.dashboardId = dashboard._id;
        this.transactions = dashboard.transactions || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard', err);
        this.loading = false;
      },
    });
  }

  removeTransaction(txId: string): void {
    if (!this.dashboardId) return;
    if (!confirm('Are you sure you want to remove this transaction?')) return;

    this.dashboardService.deleteTransaction(this.dashboardId, txId).subscribe({
      next: () => {
        // Remove the transaction from frontend array
        this.transactions = this.transactions.filter((tx) => tx._id !== txId);
        console.log('Transaction removed successfully.');
      },
      error: (err) => console.error('Error removing transaction', err),
    });
  }
}
