import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

interface TaxReminder {
  title: string;
  date: string;
  type: 'reminder' | 'payment';
}

@Component({
  selector: 'app-tax-calendar',
  templateUrl: './tax-calendar.component.html',
  styleUrls: ['./tax-calendar.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe]
})
export class TaxCalendarComponent implements OnInit {
  taxReminders: TaxReminder[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Later this will come from backend API
    const apiUrl = 'https://api.example.com/tax-reminders';

    // Temporary local data (matches your screenshot)
    this.taxReminders = [
      { title: 'Reminder: Q2 Estimated Tax Payment', date: '2025-06-01', type: 'reminder' },
      { title: 'Q2 Estimated Tax Payment', date: '2025-06-15', type: 'payment' },
      { title: 'Reminder: Q3 Estimated Tax Payment', date: '2025-09-01', type: 'reminder' },
      { title: 'Q3 Estimated Tax Payment', date: '2025-09-15', type: 'payment' }
    ];

    // Example future API call:
    // this.http.get<TaxReminder[]>(apiUrl).subscribe(data => this.taxReminders = data);
  }
}
