import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.scss']
})
export class ExpensesForm {
  expensesForm: FormGroup;
  categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];
  errorMessage: string = ''; // ✅ For displaying inside form

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExpensesForm>,
    private expenseService: ExpenseService,
    private snackBar: MatSnackBar
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
    this.dialogRef.close();
  }

  cancelForm() {
    this.expensesForm.reset();
    this.closeForm();
  }

  submitForm() {
    this.errorMessage = '';

    if (this.expensesForm.invalid) {
      const amountValue = this.expensesForm.get('amount')?.value;
      if (amountValue === 0) {
        this.errorMessage = 'Enter a valid amount';
      } else {
        this.errorMessage = 'Please fill in all required fields correctly';
      }
      return;
    }

    // ✅ Submit valid form
    this.expenseService.addExpense(this.expensesForm.value).subscribe({
      next: (res: any) => {
        console.log('✅ Expense saved:', res);

        this.snackBar.open('✔ Expense saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.dialogRef.close(res.expense);
      },
      error: (err) => {
        console.error('❌ Error saving expense:', err);

        this.snackBar.open('✖ Failed to save expense!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
