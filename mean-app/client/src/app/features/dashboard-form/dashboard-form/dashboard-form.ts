import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-form',
  templateUrl: './dashboard-form.html',
  styleUrls: ['./dashboard-form.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class DashboardForm {
  @Output() formSubmitted = new EventEmitter<any>();

  dashboardForm: FormGroup;

  constructor(private fb: FormBuilder, private dashboardService: DashboardService) {
    this.dashboardForm = this.fb.group({
      monthlyIncome: [0, Validators.required],
      monthlyExpenses: [0, Validators.required],
      estimatedTaxDue: [0],
      savingsRate: [0],
      transactions: this.fb.array([])
    });
  }

  get transactions(): FormArray {
    return this.dashboardForm.get('transactions') as FormArray;
  }

  addTransaction(): void {
    const transactionForm = this.fb.group({
      date: ['', Validators.required],
      description: [''],
      category: [''],
      amount: [0, Validators.required],
      type: ['Expense', Validators.required]
    });
    this.transactions.push(transactionForm);
  }

  removeTransaction(index: number): void {
    this.transactions.removeAt(index);
  }

  submitForm(): void {
    if (this.dashboardForm.valid) {
      const formData = this.dashboardForm.value;

      // Send form data to backend using DashboardService
      this.dashboardService.createDashboard(formData).subscribe({
        next: (res) => {
          console.log('Dashboard saved:', res);
          this.formSubmitted.emit(res); // optional: emit saved data to parent
          this.dashboardForm.reset();   // reset form after save
        },
        error: (err) => {
          console.error('Error saving dashboard:', err);
        }
      });
    }
  }
}
