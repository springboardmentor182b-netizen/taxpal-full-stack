import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DarkModeService } from '../../core/services/dark-mode.service';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-budget',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
    templateUrl: './budget.component.html',
    styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit, OnDestroy {
    form!: FormGroup;
    budgets: any[] = [];
    categories: string[] = [
        'General', 'Housing', 'Food', 'Utilities', 'Transportation',
        'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Travel', 'Other'
    ];
    userEmail: string = '';
    loading: boolean = false;
    error: string = '';
    isDarkMode = false;
    private darkModeSubscription: Subscription = new Subscription();

    constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private darkModeService: DarkModeService) { }

    ngOnInit(): void {
        this.darkModeSubscription = this.darkModeService.darkMode$.subscribe(isDark => {
            this.isDarkMode = isDark;
        });
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

    ngOnDestroy(): void {
        this.darkModeSubscription.unsubscribe();
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        const formValue = this.form.value;

        const headers = this.getHeaders();

        // Send to the budget API endpoint
        this.http.post('/api/budget', {
            amount: formValue.amount,
            category: formValue.category,
            date: formValue.date,
            description: formValue.description
        }, { headers }).subscribe({
            next: (res: any) => {
                // Add the new budget to the list
                this.budgets = [res, ...this.budgets];

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
        const headers = this.getHeaders();
        // Get budgets for the current user
        this.http.get('/api/budget', { headers }).subscribe({
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

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }
}
