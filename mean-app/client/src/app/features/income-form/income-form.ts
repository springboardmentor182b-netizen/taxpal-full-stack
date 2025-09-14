import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { theme } from '../../shared/theme/theme';
import { ElementRef } from '@angular/core';
@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './income-form.html',
  styleUrls: ['./income-form.scss']
})
export class IncomeForm {
  incomeForm: FormGroup;

  // ✅ Add categories list
  categories = ['Salary', 'Freelance', 'Business', 'Investments', 'Other'];

  constructor(private fb: FormBuilder) {
    this.incomeForm = this.fb.group({
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
    this.incomeForm.reset();
  }

  submitForm() {
    if (this.incomeForm.valid) {
      console.log('Income data:', this.incomeForm.value);
    }
  }
}



