import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TaxEstimateRequest {
  country: string;
  state: string;
  filing_status: string;
  quarter: string;
  gross_income_for_quarter: number;
  business_expenses: number;
  retirement_contribution: number;
  health_insurance_premiums: number;
  home_office_deduction: number;
}

export interface TaxEstimateResponse {
  _id: string;
  user_id: string;
  country: string;
  state: string;
  quarter: string;
  filing_status: string;
  gross_income_for_quarter: number;
  business_expenses: number;
  retirement_contribution: number;
  health_insurance_premiums: number;
  home_office_deduction: number;
  estimated_tax: number;
  due_date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxReminder {
  _id: string;
  user_id: string;
  // server returns due_date and quarter/amount/status. Keep optional fields for compatibility
  due_date?: string; // ISO date string
  date?: string; // legacy clients may send 'date'
  quarter?: string;
  amount?: number;
  status?: 'reminder' | 'payment_done';
  title?: string; // optional: client-side mapping may set this
  description?: string; // optional: client-side mapping may set this
  type?: 'payment' | 'reminder'; // optional: mapped from status
  year?: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaxEstimatorService {
  private apiUrl = `${environment.apiUrl}/v1/tax-estimates`;
  private reminderUrl = `${environment.apiUrl}/v1/tax-reminders`;

  constructor(private http: HttpClient) { }

  // Create a new tax estimate
  createTaxEstimate(data: TaxEstimateRequest): Observable<TaxEstimateResponse> {
    return this.http.post<TaxEstimateResponse>(this.apiUrl, data);
  }

  // Get all tax estimates for the current user
  getTaxEstimates(): Observable<TaxEstimateResponse[]> {
    return this.http.get<TaxEstimateResponse[]>(this.apiUrl);
  }

  // Get a specific tax estimate by ID
  getTaxEstimateById(id: string): Observable<TaxEstimateResponse> {
    return this.http.get<TaxEstimateResponse>(`${this.apiUrl}/${id}`);
  }

  // Get tax reminders for the current user
  getTaxReminders(): Observable<TaxReminder[]> {
    return this.http.get<TaxReminder[]>(this.reminderUrl);
  }

  // Update a reminder status (e.g. mark as paid)
  updateReminderStatus(id: string, status: 'reminder' | 'payment_done'): Observable<TaxReminder> {
    return this.http.patch<TaxReminder>(`${this.reminderUrl}/${id}`, { status });
  }
}