import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-budget',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './budget.component.html',
    styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
    form!: FormGroup;
    budgets: any[] = [];
    categories: string[] = [
        'General', 'Housing', 'Food', 'Utilities', 'Transportation', 
        'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Travel', 'Other'
    ];

    constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) { }

    ngOnInit(): void {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format for date input
        
        this.form = this.fb.group({
            amount: [null, [Validators.required, Validators.min(0.01)]],
            category: ['General', Validators.required],
            date: [today, Validators.required],
            description: ['', Validators.maxLength(200)]
        });

        // Load existing budgets from backend
        this.loadBudgets();
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.value;
        // Send to the correct backend API endpoint with all fields
        this.http.post('/api/users/add-simple-budget', { 
            amount: formValue.amount,
            category: formValue.category,
            date: formValue.date,
            description: formValue.description
        }).subscribe({
            next: (res: any) => {
                // Add the new budget to the list
                if (res && res.budget) {
                    this.budgets = [res.budget, ...this.budgets];
                }
                
                // Reset form
                this.form.reset({
                    amount: null,
                    category: 'General',
                    date: new Date().toISOString().slice(0, 10),
                    description: ''
                });
                alert('Budget created successfully!');
            },
            error: (err) => {
                alert('Failed to create budget!');
                console.error(err);
            }
        });
    }
    
    // Load budgets from backend
    private loadBudgets(): void {
        this.http.get('/api/users/simple-budget-list').subscribe({
            next: (data: any) => {
                this.budgets = data || [];
            },
            error: (err) => {
                console.error('Failed to load budgets:', err);
            }
        });
    }
}