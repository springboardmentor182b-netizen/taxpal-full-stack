import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './expenses-form.html',
  styleUrls: ['./expenses-form.scss']
})
export class ExpensesForm {
  expensesForm: FormGroup;

  // ✅ Add categories list
  categories = ['Salary', 'Freelance', 'Business', 'Investments', 'Other'];

  constructor(private fb: FormBuilder) {
    this.expensesForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
      notes: [''],
    });
  }

  closeForm() {
    console.log('Form closed');
  }

  cancelForm() {
    this.expensesForm.reset();
  }

  submitForm() {
    if (this.expensesForm.valid) {
      console.log('Income data:', this.expensesForm.value);
    }
  }
}



