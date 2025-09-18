import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ExpenseService } from '../../../services/expense.service';
@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],templateUrl: './expenses-form.html',
  styleUrls: ['./expenses-form.scss']
})
export class ExpensesForm {
  expensesForm: FormGroup;
  categories = ['Salary', 'Freelance', 'Business', 'Investments', 'Other'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExpensesForm>,// ✅ inject DialogRef
    private expenseService:ExpenseService
  ) {
    this.expensesForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
      notes: [''],
    });
  }

  closeForm() {
    this.dialogRef.close();   // ✅ actually closes dialog
  }

  cancelForm() {
    this.expensesForm.reset();
    this.closeForm();         // ✅ close after cancel
  }

  submitForm() {
    if (this.expensesForm.valid) {
      this.expenseService.addExpense(this.expensesForm.value).subscribe({
        next: (res: any) => { // Change type to any
          console.log('✅ Expense saved:', res);
          this.dialogRef.close(res.expense);
        },
        error: (err) => {
          console.error('❌ Error saving income:', err);
        }
      });
    }
  }
}



