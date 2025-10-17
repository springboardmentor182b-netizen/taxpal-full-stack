import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaxService } from '../../services/tax.service'; // ✅ adjust path if needed
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../core/services/dark-mode.service';

@Component({
  selector: 'app-tax-estimator',
  standalone: true,
  templateUrl: './tax-estimator.component.html',
  styleUrls: ['./tax-estimator.component.css'],
})
export class TaxEstimatorComponent implements OnInit, OnDestroy {
  taxData = {
    country: 'United States',
    state: '',
    status: 'single',
    quarter: 'Q1',
    income: 0,
    businessExpenses: 0,
    retirement: 0,
    healthInsurance: 0,
    homeOffice: 0,
    userId: '6711abcd1234ef5678901234', // replace with logged-in user ID
  };

  estimatedTax: any = null;
  isDarkMode = false;
  private darkModeSubscription!: Subscription;

  constructor(private taxService: TaxService, private darkModeService: DarkModeService) {}

  ngOnInit() {
    this.darkModeSubscription = this.darkModeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  ngOnDestroy() {
    this.darkModeSubscription.unsubscribe();
  }

  calculateTax() {
    this.taxService.calculateTax(this.taxData).subscribe({
      next: (res) => {
        this.estimatedTax = res;
        console.log('✅ Tax calculated:', res);
      },
      error: (err) => {
        console.error('❌ Tax calculation failed:', err);
      },
    });
  }
}
