import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import {
  TaxCalendarService,
  TaxCalendarItem,
  TaxCalendarSection,
  TaxType,
} from '@/app/core/services/tax-calendar.service';

@Component({
  selector: 'app-tax-calendar',
  standalone: true,
  imports: [CommonModule, DatePipe, NgFor, NgIf],
  templateUrl: './tax-calendar.component.html',
  styleUrls: ['./tax-calendar.component.css'],
})
export class TaxCalendarComponent implements OnInit {
  constructor(private router: Router, private calendarSvc: TaxCalendarService) {}

  items: TaxCalendarItem[] = [];

  ngOnInit(): void {
    this.calendarSvc.getItems().subscribe((items) => (this.items = items));
  }

  get sections(): TaxCalendarSection[] {
    return this.calendarSvc.groupByMonth(this.items);
  }

  badgeClass(t: TaxType) {
    return t === 'reminder' ? 'badge badge--reminder' : 'badge badge--payment';
  }

  onClose() {
    this.router.navigate(['/dashboard']);
  }

  goToEstimator() {
    this.router.navigate(['/tax-estimator']);
  }
}
