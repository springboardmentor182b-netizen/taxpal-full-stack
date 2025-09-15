// src/app/features/income-form/income-form.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ],
  templateUrl: './income-form.html',
  styleUrls: ['./income-form.scss']
})
export class IncomeForm {
  incomeForm: FormGroup;
  categories = ['Salary', 'Freelance', 'Business', 'Investments', 'Other'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IncomeForm>   // ✅ inject DialogRef
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
      console.log('Income data:', this.incomeForm.value);
      this.dialogRef.close(this.incomeForm.value); // ✅ return form data to parent
    }
  }
}
