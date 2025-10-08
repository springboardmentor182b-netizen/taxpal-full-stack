import { Component } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

type TaxType = 'reminder' | 'payment';

type TaxItem = {
  title: string;
  date: string | Date;      // ISO string or Date
  note?: string;            // subtitle/description line
  type: TaxType;            // badge
};

type GroupedSection = {
  monthLabel: string;       // e.g., "June 2025"
  items: TaxItem[];
};

@Component({
  selector: 'app-tax-calendar',
  standalone: true,
  imports: [CommonModule, DatePipe, NgFor, NgIf],
  templateUrl: './tax-calendar.component.html',
  styleUrls: ['./tax-calendar.component.css']
})
export class TaxCalendarComponent {
  constructor(private router: Router) {}

  // ✅ Sample data (edit/replace with your API results)
  items: TaxItem[] = [
    {
      title: 'Reminder: Q2 Estimated Tax Payment',
      date: '2025-06-01',
      note: 'Reminder for upcoming q2 estimated tax payment due on Jun 15, 2025',
      type: 'reminder'
    },
    {
      title: 'Q2 Estimated Tax Payment',
      date: '2025-06-15',
      note: 'Second quarter estimated tax payment due',
      type: 'payment'
    },
    {
      title: 'Reminder: Q3 Estimated Tax Payment',
      date: '2025-09-01',
      note: 'Reminder for upcoming q3 estimated tax payment due on Sep 15, 2025',
      type: 'reminder'
    },
    {
      title: 'Q3 Estimated Tax Payment',
      date: '2025-09-15',
      note: 'Third quarter estimated tax payment due',
      type: 'payment'
    }
  ];

  // 👉 groups items by Month Year while preserving chronological order
  get sections(): GroupedSection[] {
    // sort by date ascending
    const sorted = [...this.items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const buckets = new Map<string, TaxItem[]>();
    sorted.forEach(it => {
      const d = new Date(it.date);
      const label = d.toLocaleString(undefined, { month: 'long', year: 'numeric' }); // "June 2025"
      if (!buckets.has(label)) buckets.set(label, []);
      buckets.get(label)!.push(it);
    });

    return Array.from(buckets.entries()).map(([monthLabel, items]) => ({ monthLabel, items }));
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
