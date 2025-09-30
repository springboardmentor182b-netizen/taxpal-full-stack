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
            amount: [null, [Validators.required, Validators.min(0)]]
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        alert('BudgetService is not available. Please restore budget.service.ts or implement API calls here.');
    }
}
