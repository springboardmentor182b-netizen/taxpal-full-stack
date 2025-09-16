import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-container" [ngClass]="{'dark': isDarkMode}">
      <!-- Theme Toggle Button -->
      <button class="theme-toggle" (click)="toggleDarkMode()">
        <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </button>
      
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
              <div class="transaction-item income">
                <div class="transaction-info">
                  <h4>Freelance Web Development</h4>
                  <div class="transaction-meta">
                    <span class="date">2024-01-15</span>
                    <span class="separator">•</span>
                    <span class="category">Work</span>
                  </div>
                </div>
                <div class="transaction-amount positive">+$2,500</div>
              </div>
              
              <div class="transaction-item expense">
                <div class="transaction-info">
                  <h4>Office Supplies</h4>
                  <div class="transaction-meta">
                    <span class="date">2024-01-14</span>
                    <span class="separator">•</span>
                    <span class="category">Office</span>
                  </div>
                </div>
                <div class="transaction-amount negative">$150</div>
              </div>
              
              <div class="transaction-item expense">
                <div class="transaction-info">
                  <h4>Software Subscription</h4>
                  <div class="transaction-meta">
                    <span class="date">2024-01-13</span>
                    <span class="separator">•</span>
                    <span class="category">Tools</span>
                  </div>
                </div>
                <div class="transaction-amount negative">$29</div>
              </div>
              
              <div class="transaction-item income">
                <div class="transaction-info">
                  <h4>Client Consultation</h4>
                  <div class="transaction-meta">
                    <span class="date">2024-01-12</span>
                    <span class="separator">•</span>
                    <span class="category">Consulting</span>
                  </div>
                </div>
                <div class="transaction-amount positive">+$1,200</div>
              </div>
              
              <div class="transaction-item expense">
                <div class="transaction-info">
                  <h4>Marketing Campaign</h4>
                  <div class="transaction-meta">
                    <span class="date">2024-01-11</span>
                    <span class="separator">•</span>
                    <span class="category">Marketing</span>
                  </div>
                </div>
                <div class="transaction-amount negative">$300</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dashboard Grid - Budget and Expense Breakdown -->
        <div class="dashboard-grid">
          <!-- Budget Progress with Pie Chart -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3>Budget Progress</h3>
            </div>
            <div class="budget-pie-container">
              <div class="pie-chart-container">
                <svg class="pie-chart" viewBox="-10 -10 120 120">
                  <!-- Pie Chart Segments -->
                  <circle class="pie-chart-bg" cx="50" cy="50" r="45" />
                  
                  <!-- Office Expenses: 60% - 216 degrees -->
                  <path class="pie-segment segment-1" d="M50,50 L50,5 A45,45 0 0,1 93.3,71.9 z" />
                  
                  <!-- Software & Tools: 18.75% - 67.5 degrees -->
                  <path class="pie-segment segment-2" d="M50,50 L93.3,71.9 A45,45 0 0,1 69.6,93.1 z" />
                  
                  <!-- Marketing: 14.1% - 50.76 degrees -->
                  <path class="pie-segment segment-3" d="M50,50 L69.6,93.1 A45,45 0 0,1 31.7,93.9 z" />
                  
                  <!-- Travel: 7.15% - 25.74 degrees -->
                  <path class="pie-segment segment-4" d="M50,50 L31.7,93.9 A45,45 0 0,1 50,5 z" />
                  
                  <circle class="pie-chart-center" cx="50" cy="50" r="30" />
                  <text class="pie-total" x="50" y="45" text-anchor="middle">$2,750</text>
                  <text class="pie-total-label" x="50" y="60" text-anchor="middle">Total Spent</text>
                </svg>
              </div>
              <div class="budget-legend">
                <div class="budget-legend-item">
                  <div class="legend-color" style="background-color: #3b82f6;"></div>
                  <div class="legend-info">
                    <span class="legend-label">Office Expenses</span>
                    <div class="legend-details">
                      <span class="legend-value">$1,200</span>
                      <span class="legend-percentage">60%</span>
                    </div>
                  </div>
                </div>
                <div class="budget-legend-item">
                  <div class="legend-color" style="background-color: #10b981;"></div>
                  <div class="legend-info">
                    <span class="legend-label">Software & Tools</span>
                    <div class="legend-details">
                      <span class="legend-value">$450</span>
                      <span class="legend-percentage">18.8%</span>
                    </div>
                  </div>
                </div>
                <div class="budget-legend-item">
                  <div class="legend-color" style="background-color: #f59e0b;"></div>
                  <div class="legend-info">
                    <span class="legend-label">Marketing</span>
                    <div class="legend-details">
                      <span class="legend-value">$800</span>
                      <span class="legend-percentage">14.1%</span>
                    </div>
                  </div>
                </div>
                <div class="budget-legend-item">
                  <div class="legend-color" style="background-color: #ef4444;"></div>
                  <div class="legend-info">
                    <span class="legend-label">Travel</span>
                    <div class="legend-details">
                      <span class="legend-value">$300</span>
                      <span class="legend-percentage">7.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Expense Breakdown -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3>Expense Breakdown</h3>
            </div>
            <div class="expense-breakdown">
              <div class="breakdown-item">
                <div class="breakdown-label">
                  <div class="color-dot" style="background-color: #3b82f6;"></div>
                  <span>Rent/Mortgage</span>
                </div>
                <span class="breakdown-percentage">32%</span>
              </div>
              <div class="breakdown-item">
                <div class="breakdown-label">
                  <div class="color-dot" style="background-color: #10b981;"></div>
                  <span>Business Expenses</span>
                </div>
                <span class="breakdown-percentage">26%</span>
              </div>
              <div class="breakdown-item">
                <div class="breakdown-label">
                  <div class="color-dot" style="background-color: #f59e0b;"></div>
                  <span>Utilities</span>
                </div>
                <span class="breakdown-percentage">15%</span>
              </div>
              <div class="breakdown-item">
                <div class="breakdown-label">
                  <div class="color-dot" style="background-color: #ef4444;"></div>
                  <span>Food</span>
                </div>
                <span class="breakdown-percentage">14%</span>
              </div>
              <div class="breakdown-item">
                <div class="breakdown-label">
                  <div class="color-dot" style="background-color: #8b5cf6;"></div>
                  <span>Other</span>
                </div>
                <span class="breakdown-percentage">13%</span>
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

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button class="action-btn income-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Add Income
            </button>
            <button class="action-btn expense-btn">
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

    /* Budget Pie Chart Styles */
    .budget-pie-container {
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

    .segment-1 {
      fill: #3b82f6;
    }

    .segment-2 {
      fill: #10b981;
    }

    .segment-3 {
      fill: #f59e0b;
    }

    .segment-4 {
      fill: #ef4444;
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

    .budget-legend {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 0.75rem;
    }

    .budget-legend-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }

    .legend-info {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .legend-label {
      font-size: 0.875rem;
      color: #374151;
    }

    .legend-details {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
    }

    .legend-value {
      color: #6b7280;
    }

    .legend-percentage {
      font-weight: 600;
      color: #111827;
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

    .quick-actions h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: #111827;
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

    /* Theme Toggle Button */
    .theme-toggle {
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      background-color: white;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      z-index: 10;
      transition: all 0.2s ease;
    }
    
    .theme-toggle:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

    .dark .progress-bar {
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

    .dark .legend-label {
      color: #e5e7eb;
    }

    .dark .legend-value {
      color: #9ca3af;
    }

    .dark .legend-percentage {
      color: #f9fafb;
    }

    .dark .transaction-item:hover {
      background-color: #252f3f;
    }

    .dark .legend-item,
    .dark .month-label {
      color: #9ca3af;
    }

    .dark .bar-value {
      color: #d1d5db;
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
  `]
})
export class UserProfileComponent implements OnInit {
  isDarkMode = document.documentElement.classList.contains('dark');
  currentRoute: string = 'user-profile';
  pageTitle: string = 'Dashboard';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Get the current route
    const path = this.router.url.split('/')[1] || 'user-profile';
    this.currentRoute = path;
    
    // Set page title
    this.pageTitle = 'Dashboard';
    
    // Check for dark mode
    this.isDarkMode = document.documentElement.classList.contains('dark') || 
                      document.body.classList.contains('dark-mode');
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
}
