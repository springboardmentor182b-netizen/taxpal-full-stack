import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

    constructor(private fb: FormBuilder, private router: Router) { }

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
        const userId = localStorage.getItem('user_id') ?? undefined;

        const payload = {
            limit: formValue.amount,
            user_id: userId
        };

        // Add your API call here
        console.log('Budget payload:', payload);
        
        // Reset form after submission
        this.form.reset();
        
        alert('Budget created successfully!');
    }
}