import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';                 // for *ngFor, etc.
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BudgetService, BudgetDto } from '../../services/budget.service';

@Component({
    selector: 'app-budget',
    standalone: true,                                             // <-- standalone
    imports: [CommonModule, ReactiveFormsModule, RouterModule],                 // <-- bring in directives
    templateUrl: './budget.component.html',
    styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
    form!: FormGroup;

    categories = ['food', 'utilities', 'transportation', 'entertainment', 'healthcare', 'shopping', 'education', 'travel', 'other'];
    budgets: BudgetDto[] = [];

    constructor(private fb: FormBuilder, private router: Router, private budgetApi: BudgetService) { } // <-- inject AuthService

    ngOnInit(): void {
        const now = new Date();
        // default date is today
        const defaultDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
            .toISOString().substring(0, 10);

        this.form = this.fb.group({
            category: ['', Validators.required],
            amount: [null, [Validators.required, Validators.min(0)]],
            month: [defaultDate, Validators.required],               // dd-mm-yyyy in UI (via input[type=date])
            description: ['']
        });

        this.loadBudgets();
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        // Convert date (yyyy-MM-dd) to YYYY-MM for backend
        const raw: string = this.form.value.month;
        const month = raw?.slice(0, 7); // YYYY-MM

        const formValue = this.form.value;
        const userId = localStorage.getItem('user_id') ?? undefined; // userId is string | undefined

        const payload = {
            category: formValue.category,
            limit: formValue.amount, // <-- map amount to limit
            month: formValue.month?.slice(0, 7), // ensure YYYY-MM format
            description: formValue.description,
            user_id: userId // Now matches expected type
        };
        this.budgetApi.createBudget(payload).subscribe({
            next: (created) => {
                // Optimistically prepend and refresh list
                this.budgets = [created, ...this.budgets];
                this.form.reset({
                    category: '',
                    amount: null,
                    month: new Date().toISOString().substring(0, 10),
                    description: ''
                });
            },
            error: (err) => {
                console.error('Failed to create budget', err);
                alert('Failed to create budget. Please try again.');
            }
        });
    }

    private loadBudgets(): void {
        this.budgetApi.getBudgets().subscribe({
            next: (list) => this.budgets = list ?? [],
            error: (err) => console.error('Failed to fetch budgets', err)
        });
    }
}
