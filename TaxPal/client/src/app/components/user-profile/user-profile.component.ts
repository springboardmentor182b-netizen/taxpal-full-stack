import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="profile-container" [ngClass]="{'dark': isDarkMode}">
      <!-- User Profile Avatar -->
      <!-- REMOVE this block to stop showing the letter and name below navbar -->
      <!--
      <div class="user-profile-avatar">
        <div class="avatar-circle">
          {{ userInitial }}
        </div>
        <span class="user-full-name">{{ userName }}</span>
      </div>
      -->
      <div class="profile-content">
        <!-- Dashboard Header -->
        <div class="dashboard-header">
          <h1>Dashboard</h1>
          <p class="dashboard-subtitle">Track your freelance income, expenses, and financial goals</p>
        </div>

        <!-- Financial Metrics Cards -->
        <div class="metrics-row">
          <div class="metric-card">
            <div class="metric-header">
              <h3>Monthly Income</h3>
              <div class="metric-trend">
                <svg class="trend-icon up" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                <span class="metric-change positive">+15.2%</span>
              </div>
            </div>
            <div class="metric-value">$8,430</div>
            <div class="metric-subtitle">from last month</div>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <h3>Monthly Expenses</h3>
              <div class="metric-trend">
                <svg class="trend-icon down" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="1 18 10.5 8.5 15.5 13.5 23 6"></polyline>
                  <polyline points="17 18 23 18 23 12"></polyline>
                </svg>
                <span class="metric-change negative">-8.1%</span>
              </div>
            </div>
            <div class="metric-value">$3,245</div>
            <div class="metric-subtitle">from last month</div>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <h3>Estimated Tax Due</h3>
              <div class="metric-trend">
                <svg class="trend-icon up" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                <span class="metric-change positive">+5.3%</span>
              </div>
            </div>
            <div class="metric-value">$1,264</div>
            <div class="metric-subtitle">from last month</div>
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <h3>Savings Rate</h3>
              <div class="metric-trend">
                <svg class="trend-icon up" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                <span class="metric-change positive">+2.1%</span>
              </div>
            </div>
            <div class="metric-value">23.8%</div>
            <div class="metric-subtitle">from last month</div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="quick-actions top-actions">
          <div class="action-buttons">
            <button class="action-btn income-btn" (click)="showAddIncomeModal()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Add Income
            </button>
            <button class="action-btn expense-btn" (click)="showAddExpenseModal()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Add Expense
            </button>
            <button class="action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Transaction
            </button>
            <button class="action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Schedule Payment
            </button>
            <button class="action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Export Report
            </button>
          </div>
        </div>

        <!-- Income Table -->
        <div class="income-table-section">
          <h3 class="income-table-title">Your Income Records</h3>
          <table class="income-table" *ngIf="incomeList.length > 0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let income of incomeList">
                <td>{{ income.title }}</td>
                <td class="income-amount">{{ income.amount | currency:'USD':'symbol':'1.2-2' }}</td>
                <td>{{ income.category || '-' }}</td>
                <td>{{ income.date | date:'mediumDate' }}</td>
                <td>{{ income.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="incomeList.length === 0" class="no-income-msg">
            No income records yet.
          </div>
        </div>

        <!-- Expense Table -->
        <div class="income-table-section">
          <h3 class="income-table-title" style="color:#ef4444">Your Expense Records</h3>
          <table class="income-table" *ngIf="expenseList.length > 0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Tax Deductible</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let expense of expenseList">
                <td>{{ expense.title }}</td>
                <td class="expense-amount">{{ expense.amount | currency:'USD':'symbol':'1.2-2' }}</td>
                <td>{{ expense.category || '-' }}</td>
                <td>{{ expense.date | date:'mediumDate' }}</td>
                <td>{{ expense.taxDeductible || '-' }}</td>
                <td>{{ expense.notes || '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="expenseList.length === 0" class="no-income-msg">
            No expense records yet.
          </div>
        </div>

        <!-- Total Balance and Recent Transactions Row -->
        <div class="balance-transactions-row">
          <!-- Total Balance Card -->
          <div class="balance-card">
            <div class="balance-header">
              <h3>Total Balance</h3>
              <span class="metric-change positive">+12.5% this month</span>
            </div>
            <div class="balance-content">
              <div class="balance-value">$52,430</div>
              <div class="balance-goal">of $60,000</div>
            </div>
            <div class="balance-progress">
              <div class="circular-progress">
                <svg class="circular-chart" viewBox="0 0 36 36">
                  <path class="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path class="circle"
                    stroke-dasharray="87.4, 100"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" class="percentage">87.4%</text>
                </svg>
              </div>
              <span class="progress-text">87.4% of annual goal</span>
            </div>
          </div>

          <!-- Recent Transactions -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3>Recent Transactions</h3>
              <a href="#" class="view-all-link">View All</a>
            </div>
            <div class="transactions-list">
              <ng-container *ngIf="recentTransactions.length > 0; else noTransactions">
                <div *ngFor="let tx of recentTransactions" class="transaction-item" [ngClass]="tx.type">
                  <div class="transaction-info">
                    <h4>{{ tx.title }}</h4>
                    <div class="transaction-meta">
                      <span class="date">{{ tx.date | date:'mediumDate' }}</span>
                      <span class="separator">•</span>
                      <span class="category">{{ tx.category || (tx.type === 'income' ? 'Income' : 'Expense') }}</span>
                    </div>
                  </div>
                  <div class="transaction-amount" [ngClass]="tx.type === 'income' ? 'positive' : 'negative'">
                    {{ tx.type === 'income' ? '+' : '-' }}{{ tx.amount | currency:'USD':'symbol':'1.2-2' }}
                  </div>
                </div>
              </ng-container>
              <ng-template #noTransactions>
                <div class="no-income-msg">No recent transactions.</div>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- Dashboard Grid - Budget and Expense Breakdown -->
        <div class="dashboard-grid">
          <!-- Expense Breakdown as Pie Chart (on the left) -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3>Expense Breakdown</h3>
            </div>
            <div class="expense-pie-container">
              <div class="pie-chart-container">
                <svg class="pie-chart" viewBox="-10 -10 120 120">
                  <!-- Pie Chart Segments -->
                  <circle class="pie-chart-bg" cx="50" cy="50" r="45" />
                  
                  <!-- Rent/Mortgage: 32% -->
                  <path class="pie-segment segment-rent" d="M50,50 L50,5 A45,45 0 0,1 88.2,27.3 z" />
                  
                  <!-- Business Expenses: 26% -->
                  <path class="pie-segment segment-business" d="M50,50 L88.2,27.3 A45,45 0 0,1 93.7,74.7 z" />
                  
                  <!-- Utilities: 15% -->
                  <path class="pie-segment segment-utilities" d="M50,50 L93.7,74.7 A45,45 0 0,1 62.1,91.9 z" />
                  
                  <!-- Food: 14% -->
                  <path class="pie-segment segment-food" d="M50,50 L62.1,91.9 A45,45 0 0,1 21.7,85.2 z" />
                  
                  <!-- Other: 13% -->
                  <path class="pie-segment segment-other" d="M50,50 L21.7,85.2 A45,45 0 0,1 50,5 z" />
                  
                  <circle class="pie-chart-center" cx="50" cy="50" r="30" />
                  <text class="pie-total" x="50" y="45" text-anchor="middle">100%</text>
                  <text class="pie-total-label" x="50" y="60" text-anchor="middle">Total Expenses</text>
                </svg>
              </div>
              <div class="expense-legend">
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #3b82f6;"></div>
                  <div class="legend-info">
                    <span class="legend-label">Rent/Mortgage</span>
                    <span class="legend-percentage">32%</span>
                  </div>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #10b981;"></div>
                  <div class="legend-info">
                    <span class="legend-label">Business Expenses</span>
                    <span class="legend-percentage">26%</span>
                  </div>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #f59e0b;"></div>
                  <div class="legend-info">
                    <span class="legend-label">Utilities</span>
                    <span class="legend-percentage">15%</span>
                  </div>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #ef4444;"></div>
                  <div class="legend-info">
                    <span class="legend-label">Food</span>
                    <span class="legend-percentage">14%</span>
                  </div>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #8b5cf6;"></div>
                  <div class="legend-info">
                    <span class="legend-label">Other</span>
                    <span class="legend-percentage">13%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Budget Progress with Progress Bars (on the right) -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3>Budget Progress</h3>
            </div>
            <div class="budget-list">
              <div class="budget-item">
                <div class="budget-info">
                  <h4>Office Expenses</h4>
                  <span class="budget-amounts">$1,200 / $2,000</span>
                </div>
                <div class="budget-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 60%; background-color: #3b82f6;"></div>
                  </div>
                  <span class="progress-stats">60.0% used • $800 remaining</span>
                </div>
              </div>
              
              <div class="budget-item">
                <div class="budget-info">
                  <h4>Software & Tools</h4>
                  <span class="budget-amounts">$450 / $800</span>
                </div>
                <div class="budget-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 56.3%; background-color: #10b981;"></div>
                  </div>
                  <span class="progress-stats">56.3% used • $350 remaining</span>
                </div>
              </div>
              
              <div class="budget-item">
                <div class="budget-info">
                  <h4>Marketing</h4>
                  <span class="budget-amounts">$800 / $1,500</span>
                </div>
                <div class="budget-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 53.3%; background-color: #f59e0b;"></div>
                  </div>
                  <span class="progress-stats">53.3% used • $700 remaining</span>
                </div>
              </div>
              
              <div class="budget-item">
                <div class="budget-info">
                  <h4>Travel</h4>
                  <span class="budget-amounts">$300 / $1,000</span>
                </div>
                <div class="budget-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 30%; background-color: #ef4444;"></div>
                  </div>
                  <span class="progress-stats">30.0% used • $700 remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-grid">
          <!-- Income vs Expenses Chart -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3>Income vs Expenses</h3>
              <div class="chart-controls">
                <button class="chart-btn active">Week</button>
                <button class="chart-btn">Month</button>
                <button class="chart-btn">Year</button>
              </div>
            </div>
            <div class="chart-container">
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color income"></div>
                  <span>Income</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color expenses"></div>
                  <span>Expenses</span>
                </div>
              </div>
              
              <div class="bar-chart">
                <div class="month-group">
                  <div class="bar-container">
                    <div class="bar income-bar" style="height: 80%;" title="$8,500">
                      <span class="bar-value">$8.5k</span>
                    </div>
                    <div class="bar expense-bar" style="height: 60%;" title="$5,100">
                      <span class="bar-value">$5.1k</span>
                    </div>
                  </div>
                  <div class="month-label">Jan</div>
                </div>
                
                <div class="month-group">
                  <div class="bar-container">
                    <div class="bar income-bar" style="height: 65%;" title="$6,900">
                      <span class="bar-value">$6.9k</span>
                    </div>
                    <div class="bar expense-bar" style="height: 50%;" title="$4,200">
                      <span class="bar-value">$4.2k</span>
                    </div>
                  </div>
                  <div class="month-label">Feb</div>
                </div>
                
                <div class="month-group">
                  <div class="bar-container">
                    <div class="bar income-bar" style="height: 90%;" title="$9,600">
                      <span class="bar-value">$9.6k</span>
                    </div>
                    <div class="bar expense-bar" style="height: 62%;" title="$5,300">
                      <span class="bar-value">$5.3k</span>
                    </div>
                  </div>
                  <div class="month-label">Mar</div>
                </div>
                
                <div class="month-group">
                  <div class="bar-container">
                    <div class="bar income-bar" style="height: 75%;" title="$8,000">
                      <span class="bar-value">$8.0k</span>
                    </div>
                    <div class="bar expense-bar" style="height: 55%;" title="$4,700">
                      <span class="bar-value">$4.7k</span>
                    </div>
                  </div>
                  <div class="month-label">Apr</div>
                </div>
                
                <div class="month-group">
                  <div class="bar-container">
                    <div class="bar income-bar" style="height: 85%;" title="$9,100">
                      <span class="bar-value">$9.1k</span>
                    </div>
                    <div class="bar expense-bar" style="height: 58%;" title="$4,950">
                      <span class="bar-value">$5.0k</span>
                    </div>
                  </div>
                  <div class="month-label">May</div>
                </div>
                
                <div class="month-group">
                  <div class="bar-container">
                    <div class="bar income-bar" style="height: 95%;" title="$10,200">
                      <span class="bar-value">$10.2k</span>
                    </div>
                    <div class="bar expense-bar" style="height: 65%;" title="$5,500">
                      <span class="bar-value">$5.5k</span>
                    </div>
                  </div>
                  <div class="month-label">Jun</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Welcome Section -->
        <div class="welcome-section">
          <h2>Welcome back, Sam</h2>
          <p class="subtitle">Here's an overview of your tax and financial status</p>
        </div>
      </div>
      
      <!-- Add Income Modal -->
      <div class="modal-overlay" *ngIf="isAddIncomeModalVisible" (click)="hideAddIncomeModal($event)">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Add New Income</h2>
            <p class="modal-subtitle">Track your earnings to better manage your finances</p>
          </div>
          <div class="modal-body">
            <div *ngIf="incomeErrorMsg" class="form-error">{{ incomeErrorMsg }}</div>
            <div *ngIf="incomeSuccessMsg" class="form-success">{{ incomeSuccessMsg }}</div>
            <div class="form-group">
              <label for="income-title">Title</label>
              <input type="text" id="income-title" placeholder="Freelance project" [(ngModel)]="incomeForm.title">
            </div>
            <div class="form-group">
              <label for="income-amount">Amount</label>
              <div class="amount-input">
                <span class="currency-symbol">$</span>
                <input type="number" id="income-amount" placeholder="0.00" step="0.01" [(ngModel)]="incomeForm.amount">
              </div>
            </div>
            <div class="form-group">
              <label for="income-category">Category</label>
              <select id="income-category" [(ngModel)]="incomeForm.category">
                <option value="" disabled selected>Select category</option>
                <option value="freelance">Freelance Work</option>
                <option value="consulting">Consulting</option>
                <option value="contract">Contract Work</option>
                <option value="services">Services</option>
                <option value="sale">Product Sale</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="income-date">Date</label>
                <input type="date" id="income-date" [(ngModel)]="incomeForm.date">
              </div>
            </div>
            <div class="form-group">
              <label for="income-notes">Notes</label>
              <textarea id="income-notes" placeholder="Add any additional details..." [(ngModel)]="incomeForm.notes"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="hideAddIncomeModal()">Cancel</button>
            <button class="btn-submit" (click)="submitIncome()" [disabled]="incomeLoading">
              <span *ngIf="incomeLoading" class="loader"></span>
              <span *ngIf="!incomeLoading">Add Income</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add Expense Modal -->
      <div class="modal-overlay" *ngIf="isAddExpenseModalVisible" (click)="hideAddExpenseModal($event)">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Add New Expense</h2>
            <p class="modal-subtitle">Track your expenses to better manage your finances</p>
          </div>
          <div class="modal-body">
            <div *ngIf="expenseErrorMsg" class="form-error">{{ expenseErrorMsg }}</div>
            <div *ngIf="expenseSuccessMsg" class="form-success">{{ expenseSuccessMsg }}</div>
            <div class="form-group">
              <label for="expense-title">Title</label>
              <input type="text" id="expense-title" placeholder="Office supplies" [(ngModel)]="expenseForm.title">
            </div>
            <div class="form-group">
              <label for="expense-amount">Amount</label>
              <div class="amount-input">
                <span class="currency-symbol">$</span>
                <input type="number" id="expense-amount" placeholder="0.00" step="0.01" [(ngModel)]="expenseForm.amount">
              </div>
            </div>
            <div class="form-group">
              <label for="expense-category">Category</label>
              <select id="expense-category" [(ngModel)]="expenseForm.category">
                <option value="" disabled selected>Select category</option>
                <option value="rent">Rent/Mortgage</option>
                <option value="utilities">Utilities</option>
                <option value="business">Business Expenses</option>
                <option value="food">Food</option>
                <option value="transportation">Transportation</option>
                <option value="insurance">Insurance</option>
                <option value="marketing">Marketing</option>
                <option value="office">Office Supplies</option>
                <option value="software">Software & Subscriptions</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="expense-date">Date</label>
                <input type="date" id="expense-date" [(ngModel)]="expenseForm.date">
              </div>
              <div class="form-group">
                <label for="expense-tax-deductible">Tax Deductible</label>
                <select id="expense-tax-deductible" [(ngModel)]="expenseForm.taxDeductible">
                  <option value="" disabled selected>Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="partial">Partially</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="expense-notes">Notes</label>
              <textarea id="expense-notes" placeholder="Add any additional details..." [(ngModel)]="expenseForm.notes"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="hideAddExpenseModal()">Cancel</button>
            <button class="btn-submit expense-submit" (click)="submitExpense()" [disabled]="expenseLoading">
              <span *ngIf="expenseLoading" class="loader"></span>
              <span *ngIf="!expenseLoading">Add Expense</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Base Styles */
    .profile-container {
      min-height: calc(100vh - 80px);
      background-color: #f9fafb;
      transition: background-color 0.3s ease;
    }
    
    .profile-content {
      padding: 3rem 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    /* Dashboard Header */
    .dashboard-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .dashboard-subtitle {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 0;
    }

    /* Financial Metrics Row */
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background-color: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .metric-header h3 {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      margin: 0;
    }

    .metric-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .trend-icon {
      width: 16px;
      height: 16px;
    }

    .trend-icon.up {
      color: #10b981;
    }

    .trend-icon.down {
      color: #ef4444;
    }

    .metric-change {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .metric-change.positive {
      color: #10b981;
    }

    .metric-change.negative {
      color: #ef4444;
    }

    .metric-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.25rem;
    }

    .metric-subtitle {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    /* Balance and Transactions Row */
    .balance-transactions-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    /* Balance Card */
    .balance-card {
      background-color: white;
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .balance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .balance-header h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #6b7280;
      margin: 0;
    }

    .balance-content {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .balance-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: #111827;
    }

    .balance-goal {
      font-size: 1.125rem;
      color: #6b7280;
    }

    .balance-progress {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    /* Circular Progress Styles */
    .circular-progress {
      width: 120px;
      height: 120px;
    }

    .circular-chart {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      max-height: 100%;
    }

    .circle-bg {
      fill: none;
      stroke: #e5e7eb;
      stroke-width: 2.8;
    }

    .circle {
      fill: none;
      stroke-width: 2.8;
      stroke-linecap: round;
      animation: progress 1s ease-in-out forwards;
      stroke: #10b981;
    }

    .percentage {
      fill: #111827;
      font-family: sans-serif;
      font-size: 0.5em;
      text-anchor: middle;
      font-weight: 600;
    }

    @keyframes progress {
      0% {
        stroke-dasharray: 0 100;
      }
    }

    .progress-text {
      font-size: 0.875rem;
      color: #6b7280;
      text-align: center;
    }

    /* Dashboard Section */
    .dashboard-section {
      background-color: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .view-all-link {
      color: #3b82f6;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .view-all-link:hover {
      color: #2563eb;
    }

    /* Transactions */
    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .transaction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border-radius: 0.5rem;
      border-bottom: 1px solid #f3f4f6;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .transaction-item:hover {
      background-color: #f9fafb;
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .transaction-info h4 {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .transaction-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .separator {
      color: #d1d5db;
    }

    .transaction-amount {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .transaction-amount.positive {
      color: #10b981;
    }

    .transaction-amount.negative {
      color: #ef4444;
    }

    /* Dashboard Grid - Two Column Layout */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    /* Budget Progress Bar Styles */
    .budget-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 0.5rem 0;
    }

    .budget-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .budget-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .budget-info h4 {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111827;
      margin: 0;
    }

    .budget-amounts {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
    }

    .budget-progress .progress-bar {
      height: 8px;
      background-color: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.35rem;
    }

    .budget-progress .progress-fill {
      height: 100%;
      transition: width 0.5s ease;
    }

    .progress-stats {
      font-size: 0.75rem;
      color: #6b7280;
      display: flex;
      justify-content: space-between;
    }

    /* Expense Breakdown */
    .expense-breakdown {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-top: 1rem;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
    }

    .breakdown-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .breakdown-label span {
      font-size: 0.875rem;
      color: #374151;
    }

    .breakdown-percentage {
      font-weight: 600;
      font-size: 0.875rem;
      color: #111827;
    }

    /* Expense Pie Chart Styles */
    .expense-pie-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .pie-chart-container {
      width: 220px;
      height: 220px;
      margin: 0 auto;
      overflow: visible;
    }

    .pie-chart {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .pie-chart-bg {
      fill: #f3f4f6;
    }

    .pie-segment {
      transition: transform 0.2s ease;
      transform-origin: 50px 50px;
    }

    .pie-segment:hover {
      transform: translateX(3px) translateY(3px);
    }

    .segment-rent {
      fill: #3b82f6;
    }

    .segment-business {
      fill: #10b981;
    }

    .segment-utilities {
      fill: #f59e0b;
    }

    .segment-food {
      fill: #ef4444;
    }

    .segment-other {
      fill: #8b5cf6;
    }

    .pie-chart-center {
      fill: white;
    }

    .pie-total {
      font-size: 14px;
      font-weight: bold;
      fill: #111827;
    }

    .pie-total-label {
      font-size: 10px;
      fill: #6b7280;
    }

    .expense-legend {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 0.75rem;
    }

    .expense-legend .legend-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .expense-legend .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }

    .expense-legend .legend-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
    }

    .expense-legend .legend-label {
      font-size: 0.875rem;
      color: #374151;
    }

    .expense-legend .legend-percentage {
      font-weight: 600;
      font-size: 0.875rem;
      color: #111827;
    }

    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    /* Chart Controls */
    .chart-controls {
      display: flex;
      gap: 0.5rem;
    }

    .chart-btn {
      padding: 0.25rem 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      background-color: white;
      color: #6b7280;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .chart-btn.active,
    .chart-btn:hover {
      background-color: #3b82f6;
      border-color: #3b82f6;
      color: white;
    }

    /* Chart Container */
    .chart-container {
      padding: 1.5rem 0.5rem;
    }

    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }

    .legend-color.income {
      background-color: #10b981;
    }

    .legend-color.expenses {
      background-color: #ef4444;
    }

    /* Bar Chart Styles */
    .bar-chart {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 250px;
      padding-top: 1rem;
    }

    .month-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .bar-container {
      display: flex;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 200px;
      align-items: flex-end;
    }

    .bar {
      width: 24px;
      min-height: 4px;
      border-radius: 4px 4px 0 0;
      position: relative;
      transition: all 0.3s ease;
    }

    .bar:hover {
      opacity: 0.8;
      transform: translateY(-3px);
    }

    .income-bar {
      background-color: #10b981;
    }

    .expense-bar {
      background-color: #ef4444;
    }

    .bar-value {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.7rem;
      color: #6b7280;
      font-weight: 600;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s ease;
      margin-bottom: 4px;
    }

    .bar:hover .bar-value {
      opacity: 1;
    }

    .month-label {
      margin-top: 0.75rem;
      font-size: 0.75rem;
      color: #6b7280;
      text-align: center;
    }

    /* Welcome Section */
    .welcome-section {
      margin-bottom: 3rem;
      text-align: center;
    }
    
    .welcome-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      font-size: 1.1rem;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* Quick Actions */
    .quick-actions {
      background-color: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    /* Top Actions Specific Styles */
    .top-actions {
      margin-bottom: 2rem;
      padding: 1rem 1.5rem;
    }
    
    .top-actions .action-buttons {
      justify-content: center;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background-color: white;
      color: #374151;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background-color: #f3f4f6;
      border-color: #d1d5db;
    }

    /* Income and Expense Buttons */
    .income-btn {
      background-color: #10b981 !important;
      border-color: #059669 !important;
      color: white !important;
    }

    .income-btn:hover {
      background-color: #059669 !important;
      border-color: #047857 !important;
    }

    .expense-btn {
      background-color: #ef4444 !important;
      border-color: #dc2626 !important;
      color: white !important;
    }

    .expense-btn:hover {
      background-color: #dc2626 !important;
      border-color: #b91c1c !important;
    }
    
    /* Dark Mode Styles */
    .dark .profile-container {
      background-color: #111827;
    }

    .dark .dashboard-header h1 {
      color: #f9fafb;
    }

    .dark .dashboard-subtitle {
      color: #9ca3af;
    }

    .dark .metric-card,
    .dark .balance-card,
    .dark .dashboard-section,
    .dark .quick-actions {
      background-color: #1f2937;
    }

    .dark .metric-header h3,
    .dark .balance-header h3,
    .dark .section-header h3,
    .dark .welcome-section h2,
    .dark .quick-actions h2 {
      color: #f9fafb;
    }

    .dark .metric-value,
    .dark .balance-value {
      color: #f9fafb;
    }

    .dark .metric-subtitle,
    .dark .balance-goal,
    .dark .progress-text,
    .dark .subtitle {
      color: #9ca3af;
    }

    .dark .circle-bg {
      stroke: #334155;
    }

    .dark .percentage {
      fill: #f9fafb;
    }

    .dark .transaction-info h4,
    .dark .budget-info h4,
    .dark .breakdown-percentage {
      color: #f9fafb;
    }

    .dark .breakdown-label span {
      color: #e5e7eb;
    }

    .dark .budget-progress .progress-bar {
      background-color: #374151;
    }

    .dark .chart-btn {
      background-color: #1f2937;
      border-color: #374151;
      color: #9ca3af;
    }

    .dark .chart-btn.active,
    .dark .chart-btn:hover {
      background-color: #3b82f6;
      border-color: #3b82f6;
      color: white;
    }

    .dark .action-btn {
      background-color: #1f2937;
      border-color: #374151;
      color: #e5e7eb;
    }

    .dark .action-btn:hover {
      background-color: #374151;
      border-color: #4b5563;
    }

    .dark .income-btn {
      background-color: #059669 !important;
      border-color: #047857 !important;
      color: white !important;
    }

    .dark .income-btn:hover {
      background-color: #047857 !important;
      border-color: #065f46 !important;
    }

    .dark .expense-btn {
      background-color: #dc2626 !important;
      border-color: #b91c1c !important;
      color: white !important;
    }

    .dark .expense-btn:hover {
      background-color: #b91c1c !important;
      border-color: #991b1b !important;
    }

    .dark .theme-toggle {
      background-color: #1f2937;
      color: #f9fafb;
      border-color: #374151;
    }

    .dark .pie-chart-bg {
      fill: #374151;
    }

    .dark .pie-chart-center {
      fill: #1f2937;
    }

    .dark .pie-total {
      fill: #f9fafb;
    }

    .dark .pie-total-label {
      fill: #9ca3af;
    }

    .dark .expense-legend .legend-label {
      color: #e5e7eb;
    }

    .dark .expense-legend .legend-percentage {
      color: #f9fafb;
    }

    .dark .legend-item,
    .dark .month-label {
      color: #9ca3af;
    }

    .dark .bar-value {
      color: #d1d5db;
    }

    .dark .transaction-item:hover {
      background-color: #252f3f;
    }

    /* Modal Styles - Updated for more compact size */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }
    
    .modal-container {
      background-color: white;
      border-radius: 0.75rem;
      width: 90%;
      max-width: 450px; /* Reduced from 500px */
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      animation: modalFadeIn 0.3s ease-out;
    }
    
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .modal-header {
      padding: 1.25rem 1.5rem; /* Reduced vertical padding */
      border-bottom: 1px solid #e5e7eb;
    }
    
    .modal-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0; /* Reduced bottom margin */
    }
    
    .modal-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    
    .modal-body {
      padding: 1.25rem 1.5rem; /* Reduced vertical padding */
      max-height: 65vh; /* Maximum height to prevent overflow on small screens */
      overflow-y: auto; /* Add scrolling if needed */
    }
    
    .form-group {
      margin-bottom: 1rem; /* Reduced from 1.25rem */
    }
    
    .form-row {
      display: flex;
      gap: 1rem;
    }
    
    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.375rem; /* Reduced from 0.5rem */
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.625rem 0.75rem; /* Reduced padding */
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      color: #111827;
      background-color: white;
      transition: border-color 0.2s ease;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
      font-weight: 500;
    }
    
    .amount-input input {
      padding-left: 1.75rem;
    }
    
    .form-group textarea {
      resize: vertical;
      min-height: 80px; /* Reduced from 100px */
      max-height: 150px;
    }
    
    .modal-footer {
      padding: 1rem 1.5rem; /* Reduced padding */
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem; /* Reduced gap */
      border-top: 1px solid #e5e7eb;
    }
    
    .btn-cancel {
      padding: 0.5rem 1rem; /* More compact button */
      background-color: white;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-cancel:hover {
      background-color: #f3f4f6;
    }
    
    .btn-submit {
      padding: 0.5rem 1rem; /* More compact button */
      background-color: #10b981;
      border: 1px solid #059669;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-submit:hover {
      background-color: #059669;
    }
    
    /* Modal Submit Button Variations */
    .btn-submit.expense-submit {
      background-color: #ef4444;
      border-color: #dc2626;
    }
    
    .btn-submit.expense-submit:hover {
      background-color: #dc2626;
    }
    
    /* Dark Mode for Modal */
    .dark .modal-container {
      background-color: #1f2937;
      border-color: #374151;
    }
    
    .dark .modal-header {
      border-bottom-color: #374151;
    }
    
    .dark .modal-header h2 {
      color: #f9fafb;
    }
    
    .dark .modal-subtitle {
      color: #9ca3af;
    }
    
    .dark .form-group label {
      color: #e5e7eb;
    }
    
    .dark .form-group input,
    .dark .form-group select,
    .dark .form-group textarea {
      background-color: #374151;
      border-color: #4b5563;
      color: #f9fafb;
    }
    
    .dark .form-group input::placeholder,
    .dark .form-group textarea::placeholder {
      color: #9ca3af;
    }
    
    .dark .form-group input:focus,
    .dark .form-group select:focus,
    .dark .form-group textarea:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
    
    .dark .currency-symbol {
      color: #9ca3af;
    }
    
    .dark .modal-footer {
      border-top-color: #374151;
    }
    
    .dark .btn-cancel {
      background-color: #374151;
      border-color: #4b5563;
      color: #e5e7eb;
    }
    
    .dark .btn-cancel:hover {
      background-color: #4b5563;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .metrics-row {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .balance-transactions-row,
      .dashboard-grid,
      .charts-grid {
        grid-template-columns: 1fr;
      }
      
      .balance-progress {
        flex-direction: row;
        justify-content: center;
      }
      
      .circular-progress {
        width: 100px;
        height: 100px;
      }
      
      .pie-chart-container {
        width: 200px;
        height: 200px;
      }
      
      .bar {
        width: 20px;
      }
    }

    @media (max-width: 768px) {
      .top-actions .action-buttons {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .top-actions .action-btn {
        width: auto;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .action-btn {
        width: 100%;
        justify-content: center;
      }
      
      .bar {
        width: 18px;
      }
      
      .bar-value {
        font-size: 0.65rem;
      }
    }

    @media (max-width: 640px) {
      .top-actions .action-buttons {
        flex-direction: column;
      }
      
      .top-actions .action-btn {
        width: 100%;
      }
      
      .metrics-row {
        grid-template-columns: 1fr;
      }
      
      .balance-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
      
      .balance-progress {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
      
      .circular-progress {
        width: 80px;
        height: 80px;
      }
      
      .pie-chart-container {
        width: 180px;
        height: 180px;
      }
      
      .budget-legend {
        padding: 0 1rem;
      }
      
      .bar-chart {
        height: 200px;
      }
      
      .bar-container {
        height: 150px;
      }
      
      .bar {
        width: 12px;
      }
      
      .bar-value {
        display: none;
      }
      
      .bar:hover .bar-value {
        display: block;
      }
      
      .chart-legend {
        margin-bottom: 1rem;
      }
    }

    /* Income Table Styles */
    .income-table-section {
      margin: 2.5rem 0 2rem 0;
      background: #fff;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      padding: 2rem 1.5rem;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }

    .income-table-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 1.25rem;
      letter-spacing: 0.5px;
    }

    .income-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 0.5rem;
    }

    .income-table th, .income-table td {
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 1rem;
    }

    .income-table th {
      background: #f3f4f6;
      color: #374151;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
    }

    .income-table tr:nth-child(even) {
      background: #f9fafb;
    }

    .income-table tr:nth-child(odd) {
      background: #fff;
    }

    .income-amount {
      color: #10b981;
      font-weight: 600;
    }

    .no-income-msg {
      color: #6b7280;
      text-align: center;
      padding: 1.5rem 0 0.5rem 0;
      font-size: 1rem;
    }

    .dark .income-table-section {
      background: #1f2937;
      box-shadow: 0 1px 3px rgba(59,130,246,0.08);
    }

    .dark .income-table-title {
      color: #60a5fa;
    }

    .dark .income-table th {
      background: #374151;
      color: #f9fafb;
      border-bottom: 2px solid #374151;
    }

    .dark .income-table tr:nth-child(even) {
      background: #111827;
    }

    .dark .income-table tr:nth-child(odd) {
      background: #1f2937;
    }

    .dark .income-amount {
      color: #34d399;
    }

    .dark .no-income-msg {
      color: #9ca3af;
    }

    /* Expense Table Styles */
    .expense-amount {
      color: #ef4444;
      font-weight: 600;
    }
    .dark .expense-amount {
      color: #f87171;
    }
  `]
})
export class UserProfileComponent implements OnInit {
  isDarkMode: boolean = false;
  currentRoute: string = 'user-profile';
  pageTitle: string = 'Dashboard';
  isAddIncomeModalVisible: boolean = false;
  isAddExpenseModalVisible: boolean = false;
  incomeForm = {
    title: '',
    amount: null,
    category: '',
    date: '',
    notes: ''
  };
  expenseForm = {
    title: '',
    amount: null,
    category: '',
    date: '',
    notes: '',
    taxDeductible: ''
  };
  incomeLoading = false;
  expenseLoading = false;
  incomeErrorMsg = '';
  expenseErrorMsg = '';
  incomeSuccessMsg = '';
  expenseSuccessMsg = '';
  userName: string = '';
  userInitial: string = '';
  userEmail: string = '';
  incomeList: any[] = [];
  expenseList: any[] = [];
  recentTransactions: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Get the current route
    const path = this.router.url.split('/')[1] || 'user-profile';
    this.currentRoute = path;
    
    // Set page title
    this.pageTitle = 'Dashboard';
    
    // Check for dark mode
    this.isDarkMode = document.documentElement.classList.contains('dark') || 
                      document.body.classList.contains('dark-mode');

    this.fetchUserProfile();
    this.fetchIncomeList();
    this.fetchExpenseList();
    this.updateRecentTransactions();
  }
  
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    
    // Update document classes
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }
  
  showAddIncomeModal() {
    this.isAddIncomeModalVisible = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }
  
  hideAddIncomeModal(event?: Event) {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        this.isAddIncomeModalVisible = false;
        document.body.style.overflow = ''; // Restore scrolling
      }
    } else {
      this.isAddIncomeModalVisible = false;
      document.body.style.overflow = ''; // Restore scrolling
    }
  }
  
  showAddExpenseModal() {
    this.isAddExpenseModalVisible = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }
  
  hideAddExpenseModal(event?: Event) {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        this.isAddExpenseModalVisible = false;
        document.body.style.overflow = ''; // Restore scrolling
      }
    } else {
      this.isAddExpenseModalVisible = false;
      document.body.style.overflow = ''; // Restore scrolling
    }
  }
  
  submitIncome() {
    if (!this.incomeForm.title || !this.incomeForm.amount || !this.incomeForm.date || !this.userEmail) {
      this.incomeErrorMsg = 'Please fill all required fields.';
      return;
    }
    this.incomeLoading = true;
    this.incomeErrorMsg = '';
    this.incomeSuccessMsg = '';
    const payload = {
      ...this.incomeForm,
      userEmail: this.userEmail
    };
    this.http.post('/api/users/add-income', payload).subscribe({
      next: (res: any) => {
        this.incomeSuccessMsg = 'Income added!';
        this.fetchIncomeList(); // Refresh table after adding
        setTimeout(() => {
          this.hideAddIncomeModal();
          this.incomeForm = { title: '', amount: null, category: '', date: '', notes: '' };
          this.incomeSuccessMsg = '';
        }, 1200);
      },
      error: (err) => {
        this.incomeErrorMsg = err?.error?.error || 'Failed to add income.';
      },
      complete: () => {
        this.incomeLoading = false;
      }
    });
  }

  submitExpense() {
    if (!this.expenseForm.title || !this.expenseForm.amount || !this.expenseForm.date || !this.userEmail) {
      this.expenseErrorMsg = 'Please fill all required fields.';
      return;
    }
    this.expenseLoading = true;
    this.expenseErrorMsg = '';
    this.expenseSuccessMsg = '';
    const payload = {
      ...this.expenseForm,
      userEmail: this.userEmail
    };
    this.http.post('/api/users/add-expense', payload).subscribe({
      next: (res: any) => {
        this.expenseSuccessMsg = 'Expense added!';
        this.fetchExpenseList(); // Refresh table after adding
        setTimeout(() => {
          this.hideAddExpenseModal();
          this.expenseForm = { title: '', amount: null, category: '', date: '', notes: '', taxDeductible: '' };
          this.expenseSuccessMsg = '';
        }, 1200);
      },
      error: (err) => {
        this.expenseErrorMsg = err?.error?.error || 'Failed to add expense.';
      },
      complete: () => {
        this.expenseLoading = false;
      }
    });
  }
  
  fetchIncomeList() {
    if (!this.userEmail) {
      this.incomeList = [];
      this.updateRecentTransactions();
      return;
    }
    this.http.get<any[]>(`/api/users/income-list?userEmail=${encodeURIComponent(this.userEmail)}`).subscribe({
      next: (list) => {
        this.incomeList = Array.isArray(list)
          ? list.map(item => ({
              ...item,
              date: item.date ? new Date(item.date) : null
            }))
          : [];
        this.updateRecentTransactions();
      },
      error: () => {
        this.incomeList = [];
        this.updateRecentTransactions();
      }
    });
  }

  fetchExpenseList() {
    if (!this.userEmail) {
      this.expenseList = [];
      this.updateRecentTransactions();
      return;
    }
    this.http.get<any[]>(`/api/users/expense-list?userEmail=${encodeURIComponent(this.userEmail)}`).subscribe({
      next: (list) => {
        this.expenseList = Array.isArray(list)
          ? list.map(item => ({
              ...item,
              date: item.date ? new Date(item.date) : null
            }))
          : [];
        this.updateRecentTransactions();
      },
      error: () => {
        this.expenseList = [];
        this.updateRecentTransactions();
      }
    });
  }

  fetchUserProfile() {
    this.http.get<any>('/api/users/me').subscribe({
      next: (user) => {
        this.userName = user?.name || '';
        this.userInitial = this.userName ? this.userName.trim()[0].toUpperCase() : '';
        this.userEmail = user?.email || '';
        this.fetchIncomeList();
        this.fetchExpenseList();
      },
      error: () => {
        this.userName = '';
        this.userInitial = '';
        this.userEmail = '';
        this.incomeList = [];
        this.expenseList = [];
        this.updateRecentTransactions();
      }
    });
  }

  updateRecentTransactions() {
    // Merge and sort by date descending, take latest 5
    const txs = [
      ...this.incomeList.map(i => ({
        type: 'income',
        title: i.title,
        amount: i.amount,
        category: i.category,
        date: i.date,
      })),
      ...this.expenseList.map(e => ({
        type: 'expense',
        title: e.title,
        amount: e.amount,
        category: e.category,
        date: e.date,
      }))
    ];
    this.recentTransactions = txs
      .filter(tx => !!tx.date)
      .sort((a, b) => (b.date as any) - (a.date as any))
      .slice(0, 5);
  }

  getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
