// src/app/features/income-form/income-form.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IncomeService } from '../../../services/income.services';

@Component({
  selector: 'app-income-form',
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
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss']
})
export class IncomeForm {
  incomeForm: FormGroup;
  categories = ['Salary', 'Freelance', 'Business', 'Investments', 'Other'];
  errorMessage: string = '';  // ✅ For displaying inside the form

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IncomeForm>,
    private incomeService: IncomeService,
    private snackBar: MatSnackBar
  ) {
    this.incomeForm = this.fb.group({
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
    this.incomeForm.reset();
    this.closeForm();
  }

  submitForm() {
    this.errorMessage = '';

    if (this.incomeForm.invalid) {
      const amountValue = this.incomeForm.get('amount')?.value;

      if (amountValue === 0) {
        this.errorMessage = 'Enter a valid amount';
      } else {
        this.errorMessage = 'Please fill in all required fields correctly';
      }
      return;  // ✅ Stop submission and show error inside form
    }

    // ✅ Submit valid form
    this.incomeService.addIncome(this.incomeForm.value).subscribe({
      next: (res: any) => {
        this.snackBar.open('✔ Income saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.dialogRef.close(res.income);
      },
      error: (err) => {
        console.error('❌ Error saving income:', err);
        this.snackBar.open('✖ Failed to save income!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
