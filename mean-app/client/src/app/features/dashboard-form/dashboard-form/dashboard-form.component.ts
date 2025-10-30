import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-form',
  templateUrl: './dashboard-form.component.html',
  styleUrls: ['./dashboard-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class DashboardForm implements OnInit {
  dashboardForm: FormGroup;
  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private router: Router,
    @Optional() private dialogRef?: MatDialogRef<DashboardForm>
  ) {
    this.dashboardForm = this.fb.group({
      monthlyIncome: [0, Validators.required],
      monthlyExpenses: [0, Validators.required],
      estimatedTaxDue: [0],
      savingsRate: [0],
      transactions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const currentUser = sessionStorage.getItem('current_user') || localStorage.getItem('current_user');
    if (!currentUser) return console.error('No user logged in.');

    this.userId = JSON.parse(currentUser).id;

    this.dashboardService.getDashboard(this.userId).subscribe({
      next: (dashboard) => {
        if (!dashboard) return;

        // Patch main form fields
        this.dashboardForm.patchValue({
          monthlyIncome: dashboard.monthlyIncome,
          monthlyExpenses: dashboard.monthlyExpenses,
          estimatedTaxDue: dashboard.estimatedTaxDue,
          savingsRate: dashboard.savingsRate
        });

        // Clear transactions to avoid duplicates
        while (this.transactions.length) {
          this.transactions.removeAt(0);
        }

        // Populate transactions
        if (dashboard.transactions?.length) {
          dashboard.transactions.forEach((tx: any) => {
            this.transactions.push(this.fb.group({
              date: [tx.date ? tx.date.split('T')[0] : '', Validators.required], // YYYY-MM-DD
              description: [tx.description],
              category: [tx.category],
              amount: [tx.amount, Validators.required],
              type: [tx.type, Validators.required]
            }));
          });
        }
      },
      error: () => console.error('Error fetching dashboard')
    });
  }

  // Getter for transactions FormArray
  get transactions(): FormArray {
    return this.dashboardForm.get('transactions') as FormArray;
  }

  // Add a new transaction
  addTransaction(): void {
    this.transactions.push(this.fb.group({
      date: ['', Validators.required],
      description: [''],
      category: [''],
      amount: [0, Validators.required],
      type: ['Expense', Validators.required]
    }));
  }

  removeTransaction(index: number, txId: string): void {
  if (!txId) {
    // If transaction is new and not saved yet, just remove from form
    this.transactions.removeAt(index);
    return;
  }

  this.dashboardService.deleteTransaction(this.userId, txId).subscribe({
    next: () => {
      console.log('Transaction deleted successfully');
      this.transactions.removeAt(index);
    },
    error: (err) => console.error('Error deleting transaction', err)
  });
}

  // Submit the form
  submitForm(): void {
    if (!this.userId) return console.error('Cannot save dashboard, userId missing.');

    if (this.dashboardForm.valid) {
      const payload = {
        monthlyIncome: this.dashboardForm.value.monthlyIncome,
        monthlyExpenses: this.dashboardForm.value.monthlyExpenses,
        estimatedTaxDue: this.dashboardForm.value.estimatedTaxDue,
        savingsRate: this.dashboardForm.value.savingsRate,
        transactions: this.dashboardForm.value.transactions,
        user: this.userId
      };

      // Use updateDashboard to replace the entire dashboard
      this.dashboardService.updateDashboard(this.userId, payload).subscribe({
        next: () => {
          console.log('Dashboard saved successfully');

          if (this.dialogRef) {
            this.dialogRef.close(this.dashboardForm.value);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => console.error('Error saving dashboard', err)
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
