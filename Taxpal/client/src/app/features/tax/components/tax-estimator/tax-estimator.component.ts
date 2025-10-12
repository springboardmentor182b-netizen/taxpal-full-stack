import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  TaxEstimatorService,
  EstimatorInput,
  TaxSummary,
} from '@/app/core/services/tax-estimator.service';

@Component({
  selector: 'app-tax-estimator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tax-estimator.component.html',
  styleUrls: ['./tax-estimator.component.css'],
})
export class TaxEstimatorComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  countries: string[] = [];
  statesByCountry: Record<string, string[]> = {};
  filingStatuses: string[] = [];
  quarters: { id: 'Q1' | 'Q2' | 'Q3' | 'Q4'; label: string }[] = [];

  summary: TaxSummary = { gross: 0, deductions: 0, taxable: 0, estimatedTax: 0 };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taxSvc: TaxEstimatorService
  ) {
    this.form = this.fb.group({
      country: ['United States', Validators.required],
      state: ['California', Validators.required],
      status: ['Single', Validators.required],
      quarter: ['Q2', Validators.required],
      grossIncome: [0, [Validators.min(0)]],
      businessExpenses: [0, [Validators.min(0)]],
      retirement: [0, [Validators.min(0)]],
      health: [0, [Validators.min(0)]],
      homeOffice: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    // load dropdown data from service
    this.countries = this.taxSvc.getCountries();
    this.statesByCountry = this.taxSvc.getStatesByCountry();
    this.filingStatuses = this.taxSvc.getFilingStatuses();
    this.quarters = this.taxSvc.getQuarters(2025);

    // keep state in-sync with country
    this.form.get('country')!.valueChanges.subscribe((c: string) => {
      const states = this.statesByCountry[c] || [];
      const current = this.form.get('state')!.value;
      if (!states.includes(current)) {
        this.form.get('state')!.setValue(states[0] ?? '');
      }
    });
  }

  onClose(): void {
    this.close.emit();
    this.router.navigate(['/tax-calendar']);
  }

  calc(): void {
    const v = this.form.value as EstimatorInput;
    this.summary = this.taxSvc.calculateEstimate(v);
  }

  asCurrency(n: number): string {
    const code =
      this.form.value.country === 'India' ? 'INR' :
      this.form.value.country === 'Canada' ? 'CAD' : 'USD';

    return isFinite(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: code, maximumFractionDigits: 2 })
      : '—';
  }
}
