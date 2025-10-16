import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DarkModeService } from '../../core/services/dark-mode.service';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  transactions: Transaction[] = [];
  private darkModeSubscription: Subscription = new Subscription();

  constructor(private http: HttpClient, private darkModeService: DarkModeService) {}

  ngOnInit(): void {
    this.darkModeSubscription = this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    this.darkModeSubscription.unsubscribe();
  }

  loadTransactions(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      this.http.get<Transaction[]>('/api/transactions', { headers }).subscribe({
        next: (data) => {
          this.transactions = data;
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
        }
      });
    }
  }
}
