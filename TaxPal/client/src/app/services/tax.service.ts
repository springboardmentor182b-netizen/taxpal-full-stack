import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface TaxEvent {
  date: Date;
  title: string;
  description: string;
  type: 'deadline' | 'reminder' | 'payment' | 'filing';
  priority: 'high' | 'medium' | 'low';
}

export interface TaxEstimateResponse {
  taxableIncome: number;
  totalDeductions: number;
  totalTax: number;
  effectiveTaxRate: number;
  breakdown: {
    federalTax: number;
    stateTax: number;
    selfEmploymentTax: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  private apiUrl = 'http://localhost:3000/api/TaxEstimator';
  private taxEventsSubject = new BehaviorSubject<TaxEvent[]>([]);
  taxEvents$ = this.taxEventsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialEvents();
  }

  getTaxReminders(): Observable<TaxEvent[]> {
    return this.http.get<TaxEvent[]>(`${this.apiUrl}/events`);
  }

  calculateTax(data: any): Observable<TaxEstimateResponse> {
    return this.http.post<TaxEstimateResponse>(`${this.apiUrl}/calculate`, data).pipe(
      tap((response) => {
        // Create a payment reminder for the estimated tax
        this.addTaxPaymentReminder(data, response.totalTax);
      })
    );
  }

  // Add a tax payment reminder based on calculation
  private addTaxPaymentReminder(data: any, amount: number): void {
    const quarterDates: Record<string, Date> = {
      Q1: new Date(new Date().getFullYear(), 3, 15), // April 15
      Q2: new Date(new Date().getFullYear(), 5, 15), // June 15
      Q3: new Date(new Date().getFullYear(), 8, 15), // September 15
      Q4: new Date(new Date().getFullYear(), 11, 31), // December 31
    };

    const quarter = data.quarter || 'Q2';
    const reminderDate = quarterDates[quarter as keyof typeof quarterDates] || new Date();

    const newEvent: TaxEvent = {
      date: reminderDate,
      title: `${quarter} Estimated Tax Payment Due`,
      description: `Estimated tax payment of ${amount.toFixed(
        2
      )} USD due based on recent calculation.`,
      type: 'payment',
      priority: 'high',
    };

    const currentEvents = this.taxEventsSubject.value;
    this.taxEventsSubject.next([...currentEvents, newEvent]);

    // Optionally save to server
    this.saveEvent(newEvent).subscribe();
  }

  // Load initial events
  private loadInitialEvents(): void {
    this.getTaxReminders().subscribe({
      next: (events) => {
        // Convert string dates to Date objects
        const formattedEvents = events.map((event) => ({
          ...event,
          date: new Date(event.date),
        }));
        this.taxEventsSubject.next(formattedEvents);
      },
      error: () => {
        // Use default events if API fails
        const defaultEvents = this.getDefaultEvents();
        this.taxEventsSubject.next(defaultEvents);
      },
    });
  }

  // Save a new tax event
  saveEvent(event: TaxEvent): Observable<any> {
    return this.http.post(`${this.apiUrl}/events`, event);
  }

  // Default events for fallback
  private getDefaultEvents(): TaxEvent[] {
    const currentYear = new Date().getFullYear();
    return [
      {
        date: new Date(currentYear, 3, 15),
        title: 'Q1 Tax Payment Due',
        description: 'First quarter estimated tax payment deadline',
        type: 'payment',
        priority: 'high',
      },
      {
        date: new Date(currentYear, 5, 15),
        title: 'Q2 Tax Payment Due',
        description: 'Second quarter estimated tax payment deadline',
        type: 'payment',
        priority: 'high',
      },
      {
        date: new Date(currentYear, 8, 15),
        title: 'Q3 Tax Payment Due',
        description: 'Third quarter estimated tax payment deadline',
        type: 'payment',
        priority: 'high',
      },
      {
        date: new Date(currentYear, 0, 15),
        title: 'Q4 Tax Payment Due',
        description: 'Fourth quarter estimated tax payment deadline',
        type: 'payment',
        priority: 'high',
      },
    ];
  }
}
