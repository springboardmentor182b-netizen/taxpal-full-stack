import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  template: `
    <app-navbar></app-navbar>
    
    <div class="dashboard-container" [ngClass]="{'dark': isDarkMode}">
      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Welcome to your TaxPal Dashboard</h1>
          <p class="subtitle">Track your income, expenses, and get a clear view of your financial health.</p>
        </div>
        
        <div class="dashboard-summary">
          <div class="summary-card">
            <div class="card-icon income-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
            <div class="card-content">
              <h3>Total Income</h3>
              <p class="amount">${{ totalIncome.toFixed(2) }}</p>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="card-icon expense-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                <polyline points="17 18 23 18 23 12"></polyline>
              </svg>
            </div>
            <div class="card-content">
              <h3>Total Expenses</h3>
              <p class="amount">${{ totalExpenses.toFixed(2) }}</p>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="card-icon balance-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div class="card-content">
              <h3>Net Balance</h3>
              <p class="amount" [ngClass]="{'positive': netBalance >= 0, 'negative': netBalance < 0}">${{ netBalance.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="action-btn add-income-btn" (click)="showIncomeForm = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add Income
          </button>
          <button class="action-btn add-expense-btn" (click)="showExpenseForm = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Add Expense
          </button>
        </div>
        
        <!-- Income Form Dialog -->
        <div class="form-dialog" *ngIf="showIncomeForm" [ngClass]="{'dark': isDarkMode}">
          <div class="dialog-overlay" (click)="showIncomeForm = false"></div>
          <div class="dialog-content">
            <div class="dialog-header">
              <h3>Add New Income</h3>
              <button class="close-btn" (click)="showIncomeForm = false">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="dialog-body">
              <div class="form-group">
                <label for="income-description">Description</label>
                <input type="text" id="income-description" [(ngModel)]="newIncome.description" placeholder="e.g. Client Payment">
              </div>
              <div class="form-group">
                <label for="income-amount">Amount</label>
                <div class="amount-input">
                  <span class="currency-symbol">$</span>
                  <input type="number" id="income-amount" [(ngModel)]="newIncome.amount" placeholder="0.00" step="0.01" min="0">
                </div>
              </div>
              <div class="form-group">
                <label for="income-date">Date</label>
                <input type="date" id="income-date" [(ngModel)]="newIncome.date">
              </div>
              <div class="form-group">
                <label for="income-category">Category</label>
                <select id="income-category" [(ngModel)]="newIncome.category">
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="investment">Investment</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div class="dialog-footer">
              <button class="cancel-btn" (click)="showIncomeForm = false">Cancel</button>
              <button class="save-btn" (click)="addIncome()">Save Income</button>
            </div>
          </div>
        </div>
        
        <!-- Expense Form Dialog -->
        <div class="form-dialog" *ngIf="showExpenseForm" [ngClass]="{'dark': isDarkMode}">
          <div class="dialog-overlay" (click)="showExpenseForm = false"></div>
          <div class="dialog-content">
            <div class="dialog-header">
              <h3>Add New Expense</h3>
              <button class="close-btn" (click)="showExpenseForm = false">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="dialog-body">
              <div class="form-group">
                <label for="expense-description">Description</label>
                <input type="text" id="expense-description" [(ngModel)]="newExpense.description" placeholder="e.g. Office Supplies">
              </div>
              <div class="form-group">
                <label for="expense-amount">Amount</label>
                <div class="amount-input">
                  <span class="currency-symbol">$</span>
                  <input type="number" id="expense-amount" [(ngModel)]="newExpense.amount" placeholder="0.00" step="0.01" min="0">
                </div>
              </div>
              <div class="form-group">
                <label for="expense-date">Date</label>
                <input type="date" id="expense-date" [(ngModel)]="newExpense.date">
              </div>
              <div class="form-group">
                <label for="expense-category">Category</label>
                <select id="expense-category" [(ngModel)]="newExpense.category">
                  <option value="office">Office Supplies</option>
                  <option value="travel">Travel</option>
                  <option value="utilities">Utilities</option>
                  <option value="rent">Rent</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label for="expense-deductible">Tax Deductible</label>
                <div class="toggle-switch">
                  <input type="checkbox" id="expense-deductible" [(ngModel)]="newExpense.deductible">
                  <label for="expense-deductible" class="toggle-label"></label>
                </div>
              </div>
            </div>
            <div class="dialog-footer">
              <button class="cancel-btn" (click)="showExpenseForm = false">Cancel</button>
              <button class="save-btn" (click)="addExpense()">Save Expense</button>
            </div>
          </div>
        </div>
        
        <!-- Recent Transactions -->
        <div class="transactions-section" *ngIf="transactions.length > 0">
          <h2>Recent Transactions</h2>
          <div class="transaction-list">
            <div class="transaction-item" *ngFor="let transaction of transactions" [ngClass]="{'income': transaction.type === 'income', 'expense': transaction.type === 'expense'}">
              <div class="transaction-icon">
                <svg *ngIf="transaction.type === 'income'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                <svg *ngIf="transaction.type === 'expense'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                  <polyline points="17 18 23 18 23 12"></polyline>
                </svg>
              </div>
              <div class="transaction-details">
                <div class="transaction-description">
                  <h4>{{ transaction.description }}</h4>
                  <span class="transaction-category">{{ transaction.category }}</span>
                </div>
                <div class="transaction-amount-date">
                  <p class="transaction-amount" [ngClass]="{'income': transaction.type === 'income', 'expense': transaction.type === 'expense'}">
                    {{ (transaction.type === 'income' ? '+' : '-') + '$' + transaction.amount.toFixed(2) }}
                  </p>
                  <span class="transaction-date">{{ transaction.date | date:'MMM d, yyyy' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="empty-state" *ngIf="transactions.length === 0">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M7 15h0"></path>
              <path d="M12 15h0"></path>
              <path d="M17 15h0"></path>
              <path d="M7 8h10"></path>
            </svg>
          </div>
          <h2>No transactions yet</h2>
          <p>Start by adding your income and expenses using the buttons above.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: calc(100vh - 80px);
      background-color: #f9fafb;
      padding: 3rem 1.5rem;
      transition: background-color 0.3s ease;
    }
    
    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .welcome-section {
      margin-bottom: 2.5rem;
      text-align: center;
    }
    
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 1rem;
    }
    
    .subtitle {
      font-size: 1.1rem;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* Dashboard Summary Cards */
    .dashboard-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    
    .summary-card {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 12px;
      margin-right: 1.25rem;
      flex-shrink: 0;
    }
    
    .income-icon {
      background-color: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }
    
    .expense-icon {
      background-color: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
    
    .balance-icon {
      background-color: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }
    
    .card-content h3 {
      font-size: 0.9rem;
      font-weight: 500;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }
    
    .amount {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
    }
    
    .positive {
      color: #10b981;
    }
    
    .negative {
      color: #ef4444;
    }
    
    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }
    
    .add-income-btn {
      background-color: #10b981;
      color: white;
    }
    
    .add-income-btn:hover {
      background-color: #059669;
    }
    
    .add-expense-btn {
      background-color: #ef4444;
      color: white;
    }
    
    .add-expense-btn:hover {
      background-color: #dc2626;
    }
    
    /* Transactions Section */
    .transactions-section {
      margin-top: 2rem;
    }
    
    .transactions-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1.25rem;
    }
    
    .transaction-list {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }
    
    .transaction-item {
      display: flex;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f3f4f6;
      transition: background-color 0.2s;
    }
    
    .transaction-item:last-child {
      border-bottom: none;
    }
    
    .transaction-item:hover {
      background-color: #f9fafb;
    }
    
    .transaction-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    
    .income .transaction-icon {
      background-color: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }
    
    .expense .transaction-icon {
      background-color: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
    
    .transaction-details {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-grow: 1;
    }
    
    .transaction-description h4 {
      font-size: 1rem;
      font-weight: 500;
      color: #111827;
      margin-bottom: 0.25rem;
    }
    
    .transaction-category {
      font-size: 0.85rem;
      color: #6b7280;
      text-transform: capitalize;
    }
    
    .transaction-amount-date {
      text-align: right;
    }
    
    .transaction-amount {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .transaction-amount.income {
      color: #10b981;
    }
    
    .transaction-amount.expense {
      color: #ef4444;
    }
    
    .transaction-date {
      font-size: 0.85rem;
      color: #6b7280;
    }
    
    /* Form Dialog */
    .form-dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .dialog-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }
    
    .dialog-content {
      position: relative;
      width: 90%;
      max-width: 500px;
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      z-index: 1001;
    }
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .dialog-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }
    
    .close-btn {
      background: transparent;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }
    
    .close-btn:hover {
      background-color: #f3f4f6;
      color: #111827;
    }
    
    .dialog-body {
      padding: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1.25rem;
    }
    
    .form-group label {
      display: block;
      font-size: 0.9rem;
      font-weight: 500;
      color: #4b5563;
      margin-bottom: 0.5rem;
    }
    
    .form-group input[type="text"],
    .form-group input[type="number"],
    .form-group input[type="date"],
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      color: #111827;
      background-color: white;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }
    
    .amount-input {
      position: relative;
    }
    
    .currency-symbol {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
    }
    
    .amount-input input {
      padding-left: 1.75rem;
    }
    
    /* Toggle Switch */
    .toggle-switch {
      display: inline-block;
      position: relative;
    }
    
    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .toggle-label {
      display: block;
      width: 48px;
      height: 24px;
      background-color: #e5e7eb;
      border-radius: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
      position: relative;
    }
    
    .toggle-label:after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.2s;
    }
    
    input:checked + .toggle-label {
      background-color: #3b82f6;
    }
    
    input:checked + .toggle-label:after {
      transform: translateX(24px);
    }
    
    .dialog-footer {
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      border-top: 1px solid #e5e7eb;
    }
    
    .cancel-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      background-color: white;
      color: #4b5563;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .cancel-btn:hover {
      background-color: #f3f4f6;
    }
    
    .save-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      background-color: #3b82f6;
      color: white;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .save-btn:hover {
      background-color: #2563eb;
    }
    
    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .empty-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
      color: #9ca3af;
    }
    
    .empty-state h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.75rem;
    }
    
    .empty-state p {
      color: #6b7280;
      max-width: 500px;
      margin: 0 auto;
    }
    
    /* Dark Mode Styles */
    .dashboard-container.dark {
      background-color: #111827;
    }
    
    .dark h1, .dark h2 {
      color: #f9fafb;
    }
    
    .dark .subtitle, .dark .empty-state p {
      color: #9ca3af;
    }
    
    .dark .summary-card, 
    .dark .transaction-list,
    .dark .empty-state,
    .dark .dialog-content {
      background-color: #1f2937;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }
    
    .dark .amount,
    .dark .transaction-description h4,
    .dark .dialog-header h3,
    .dark .empty-state h2 {
      color: #f9fafb;
    }
    
    .dark .card-content h3,
    .dark .transaction-category,
    .dark .transaction-date,
    .dark .form-group label {
      color: #d1d5db;
    }
    
    .dark .empty-icon {
      color: #6b7280;
    }
    
    .dark .transaction-item {
      border-bottom-color: #374151;
    }
    
    .dark .transaction-item:hover {
      background-color: #272f3d;
    }
    
    .dark .dialog-header,
    .dark .dialog-footer {
      border-color: #374151;
    }
    
    .dark .close-btn {
      color: #9ca3af;
    }
    
    .dark .close-btn:hover {
      background-color: #374151;
      color: #f9fafb;
    }
    
    .dark .form-group input,
    .dark .form-group select,
    .dark .cancel-btn {
      background-color: #374151;
      border-color: #4b5563;
      color: #f9fafb;
    }
    
    .dark .form-group input:focus,
    .dark .form-group select:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }
    
    .dark .cancel-btn:hover {
      background-color: #4b5563;
    }
    
    .dark .currency-symbol {
      color: #9ca3af;
    }
    
    .dark .toggle-label {
      background-color: #4b5563;
    }
    
    .dark .toggle-label:after {
      background-color: #f9fafb;
    }
    
    /* Media Queries */
    @media (max-width: 768px) {
      .dashboard-summary {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .transaction-details {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .transaction-amount-date {
        text-align: left;
        margin-top: 0.5rem;
      }
    }
    
    @media (max-width: 640px) {
      .dashboard-container {
        padding: 2rem 1rem;
      }
      
      h1 {
        font-size: 1.75rem;
      }
      
      .subtitle {
        font-size: 1rem;
      }
      
      .dialog-content {
        width: 95%;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  isDarkMode = document.documentElement.classList.contains('dark');
  
  // Financial summaries
  totalIncome = 0;
  totalExpenses = 0;
  netBalance = 0;
  
  // Form visibility
  showIncomeForm = false;
  showExpenseForm = false;
  
  // New transaction objects
  newIncome = {
    description: '',
    amount: 0,
    date: this.formatDate(new Date()),
    category: 'freelance'
  };
  
  newExpense = {
    description: '',
    amount: 0,
    date: this.formatDate(new Date()),
    category: 'office',
    deductible: false
  };
  
  // Transactions array
  transactions: any[] = [];
  
  ngOnInit() {
    // Check for dark mode on component initialization
    this.isDarkMode = document.documentElement.classList.contains('dark') || 
                      document.body.classList.contains('dark-mode');
    
    // Load saved transactions from localStorage if available
    this.loadTransactions();
    this.calculateSummary();
  }
  
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  loadTransactions() {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      this.transactions = JSON.parse(savedTransactions);
      
      // Sort by date (newest first)
      this.transactions.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
  }
  
  calculateSummary() {
    this.totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    this.totalExpenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    this.netBalance = this.totalIncome - this.totalExpenses;
  }
  
  addIncome() {
    // Validate form
    if (!this.newIncome.description || this.newIncome.amount <= 0 || !this.newIncome.date) {
      alert('Please fill out all fields correctly.');
      return;
    }
    
    // Create transaction object
    const incomeTransaction = {
      id: Date.now(),
      type: 'income',
      description: this.newIncome.description,
      amount: this.newIncome.amount,
      date: this.newIncome.date,
      category: this.newIncome.category
    };
    
    // Add to transactions array
    this.transactions.unshift(incomeTransaction);
    
    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
    
    // Update summary
    this.calculateSummary();
    
    // Reset form and close dialog
    this.newIncome = {
      description: '',
      amount: 0,
      date: this.formatDate(new Date()),
      category: 'freelance'
    };
    
    this.showIncomeForm = false;
  }
  
  addExpense() {
    // Validate form
    if (!this.newExpense.description || this.newExpense.amount <= 0 || !this.newExpense.date) {
      alert('Please fill out all fields correctly.');
      return;
    }
    
    // Create transaction object
    const expenseTransaction = {
      id: Date.now(),
      type: 'expense',
      description: this.newExpense.description,
      amount: this.newExpense.amount,
      date: this.newExpense.date,
      category: this.newExpense.category,
      deductible: this.newExpense.deductible
    };
    
    // Add to transactions array
    this.transactions.unshift(expenseTransaction);
    
    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
    
    // Update summary
    this.calculateSummary();
    
    // Reset form and close dialog
    this.newExpense = {
      description: '',
      amount: 0,
      date: this.formatDate(new Date()),
      category: 'office',
      deductible: false
    };
    
    this.showExpenseForm = false;
  }
}
