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

  // Optional dialog reference (will be undefined if used as a page)
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
  
    // Fetch dashboard for the current user
    this.dashboardService.getDashboard(this.userId).subscribe({
      next: (dashboard) => {
        if (dashboard) {
          // PATCH the form with existing dashboard data
          this.dashboardForm.patchValue({
            monthlyIncome: dashboard.monthlyIncome,
            monthlyExpenses: dashboard.monthlyExpenses,
            estimatedTaxDue: dashboard.estimatedTaxDue,
            savingsRate: dashboard.savingsRate
          });
  
          // Populate transactions if exist
          if (dashboard.transactions && dashboard.transactions.length > 0) {
            dashboard.transactions.forEach((tx: any) => {
              this.transactions.push(this.fb.group({
                date: [tx.date, Validators.required],
                description: [tx.description],
                category: [tx.category],
                amount: [tx.amount, Validators.required],
                type: [tx.type, Validators.required]
              }));
            });
          }
        } else {
          console.log('No dashboard yet, user can create one.');
        }
      },
      error: () => console.log('Error fetching dashboard, show form.')
    });
  }

  get transactions(): FormArray {
    return this.dashboardForm.get('transactions') as FormArray;
  }

  addTransaction(): void {
    this.transactions.push(this.fb.group({
      date: ['', Validators.required],
      description: [''],
      category: [''],
      amount: [0, Validators.required],
      type: ['Expense', Validators.required]
    }));
  }

  removeTransaction(index: number): void {
    this.transactions.removeAt(index);
  }

  submitForm(): void {
    if (!this.userId) return console.error('Cannot save dashboard, userId missing.');

    if (this.dashboardForm.valid) {
      const payload = { ...this.dashboardForm.value, user: this.userId };
      this.dashboardService.upsertDashboard(this.userId, payload).subscribe({
        next: () => {
          console.log('Dashboard saved successfully');

          // If opened as a dialog → close it safely
          if (this.dialogRef) {
            this.dialogRef.close(this.dashboardForm.value);
          } else {
            // If standalone page → redirect to dashboard
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => console.error('Error saving dashboard', err)
      });
    }
  }
}
