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

    constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            amount: [null, [Validators.required, Validators.min(0.01)]]
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formValue = this.form.value;
        // Send to the correct backend API endpoint
        this.http.post('/api/users/add-simple-budget', { amount: formValue.amount }).subscribe({
            next: (res) => {
                // Optionally update budgets list here
                this.form.reset();
                alert('Budget created successfully!');
            },
            error: (err) => {
                alert('Failed to create budget!');
                console.error(err);
            }
        });
    }
}