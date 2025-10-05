import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-tax-estimator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tax-estimator.component.html',
  styleUrls: ['./tax-estimator.component.css']
})
export class TaxEstimatorComponent implements OnInit {
  @Output() close = new EventEmitter<void>();  // ✅ let parent close the view
  form: FormGroup;

  // dropdown data
  countries = ['United States', 'India', 'Canada'];
  statesByCountry: Record<string, string[]> = {
    'United States': ['California', 'New York', 'Texas', 'Florida'],
    India: ['Gujarat', 'Maharashtra', 'Karnataka', 'Delhi'],
    Canada: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
  };
  filingStatuses = [
    'Single',
    'Married Filing Jointly',
    'Married Filing Separately',
    'Head of Household',
  ];
  quarters = [
    { id: 'Q1', label: 'Q1 (Jan–Mar 2025)' },
    { id: 'Q2', label: 'Q2 (Apr–Jun 2025)' },
    { id: 'Q3', label: 'Q3 (Jul–Sep 2025)' },
    { id: 'Q4', label: 'Q4 (Oct–Dec 2025)' },
  ];

  // summary (right card)
  summary = { gross: 0, deductions: 0, taxable: 0, estimatedTax: 0 };

  constructor(private fb: FormBuilder) {
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
    this.close.emit(); // ✅ bubble up to dashboard
  }

  calc(): void {
    const v = this.form.value;

    const gross = this.num(v.grossIncome);
    const deductions =
      this.num(v.businessExpenses) +
      this.num(v.retirement) +
      this.num(v.health) +
      this.num(v.homeOffice);

    const taxable = Math.max(0, gross - deductions);

    // Illustrative rate (demo only)
    let rate = 0.2;
    if (v.country === 'United States') rate = 0.25;
    if (v.country === 'India') rate = 0.15;
    if (v.country === 'Canada') rate = 0.18;

    const estimatedTax = taxable * rate;
    this.summary = { gross, deductions, taxable, estimatedTax };
  }

  asCurrency(n: number): string {
    const code =
      this.form.value.country === 'India' ? 'INR' :
      this.form.value.country === 'Canada' ? 'CAD' : 'USD';

    return isFinite(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: code, maximumFractionDigits: 2 })
      : '—';
  }

  private num(x: any): number {
    const n = Number(x);
    return isNaN(n) ? 0 : n;
  }
}
