import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';                 // for *ngFor, etc.
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budgets',
  standalone: true,                                             // <-- standalone
  imports: [CommonModule, ReactiveFormsModule],                 // <-- bring in directives
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css']
})
export class BudgetsComponent implements OnInit {
  form!: FormGroup;

  categories = ['Groceries','Rent','Utilities','Transport','Entertainment','Other'];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    const now = new Date();
    const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    this.form = this.fb.group({
      category: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      month: [defaultMonth, Validators.required],               // default month
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Create Budget payload:', this.form.value);
    this.router.navigate(['/dashboard']);
  }
}
