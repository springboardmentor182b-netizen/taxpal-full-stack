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
    userEmail: string = '';
    loading: boolean = false;
    error: string = '';

    constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) { }

    ngOnInit(): void {
        // Get user email from localStorage
        this.userEmail = localStorage.getItem('user_email') || '';
        
        // If no user email, redirect to login
        if (!this.userEmail) {
            this.router.navigate(['/']);
            return;
        }
        
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
        if (this.form.invalid || !this.userEmail) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        const formValue = this.form.value;
        
        // Send to the correct backend API endpoint with all fields including userEmail
        this.http.post('/api/users/add-simple-budget', { 
            userEmail: this.userEmail,
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
                
                // Show success message
                alert('Budget created successfully!');
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to create budget';
                console.error(err);
                this.loading = false;
            }
        });
    }
    
    // Load budgets from backend
    private loadBudgets(): void {
        // Check if user is logged in
        if (!this.userEmail) return;
        
        this.loading = true;
        // Get budgets for the current user only
        this.http.get(`/api/users/simple-budget-list?userEmail=${encodeURIComponent(this.userEmail)}`).subscribe({
            next: (data: any) => {
                this.budgets = data || [];
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load budgets:', err);
                this.error = 'Failed to load budgets';
                this.loading = false;
            }
        });
    }
}