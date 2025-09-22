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
  templateUrl: './income-form.html',
  styleUrls: ['./income-form.scss']
})
export class IncomeForm {
  incomeForm: FormGroup;
  categories = ['Salary', 'Freelance', 'Business', 'Investments', 'Other'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IncomeForm>,   // ✅ inject DialogRef
    private incomeService:IncomeService,
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
    this.dialogRef.close();   // ✅ actually closes dialog
  }
  cancelForm() {
    this.incomeForm.reset();
    this.closeForm();         // ✅ close after cancel
  }
  submitForm() {
    if (this.incomeForm.valid) {
      this.incomeService.addIncome(this.incomeForm.value).subscribe({
        next: (res: any) => {
          console.log('✅ Income saved:', res);
  
          this.snackBar.open('✔ Income saved successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']   // ✅ applies green background
          });
  
          this.dialogRef.close(res.income);
        },
        error: (err) => {
          console.error('❌ Error saving income:', err);
  
          this.snackBar.open('✖ Failed to save income!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']    // ✅ applies red background
          });
        }
      });
    }
  }
  
  
}
