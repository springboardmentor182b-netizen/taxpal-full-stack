import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type TaxType = 'reminder' | 'payment';

export interface TaxCalendarItem {
  title: string;
  date: string | Date;
  note?: string;
  type: TaxType;
}

export interface TaxCalendarSection {
  monthLabel: string; // e.g. "June 2025"
  items: TaxCalendarItem[];
}

@Injectable({ providedIn: 'root' })
export class TaxCalendarService {
  /** Stubbed data (swap to HttpClient when backend is ready) */
  getItems(): Observable<TaxCalendarItem[]> {
    return of([
      {
        title: 'Reminder: Q2 Estimated Tax Payment',
        date: '2025-06-01',
        note: 'Reminder for upcoming q2 estimated tax payment due on Jun 15, 2025',
        type: 'reminder',
      },
      {
        title: 'Q2 Estimated Tax Payment',
        date: '2025-06-15',
        note: 'Second quarter estimated tax payment due',
        type: 'payment',
      },
      {
        title: 'Reminder: Q3 Estimated Tax Payment',
        date: '2025-09-01',
        note: 'Reminder for upcoming q3 estimated tax payment due on Sep 15, 2025',
        type: 'reminder',
      },
      {
        title: 'Q3 Estimated Tax Payment',
        date: '2025-09-15',
        note: 'Third quarter estimated tax payment due',
        type: 'payment',
      },
    ]);
  }

  /** Group items by month label, preserving chronological order */
  groupByMonth(items: TaxCalendarItem[]): TaxCalendarSection[] {
    const sorted = [...items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const buckets = new Map<string, TaxCalendarItem[]>();
    for (const it of sorted) {
      const d = new Date(it.date);
      const label = d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
      if (!buckets.has(label)) buckets.set(label, []);
      buckets.get(label)!.push(it);
    }

    return Array.from(buckets.entries()).map(([monthLabel, items]) => ({ monthLabel, items }));
  }
}
