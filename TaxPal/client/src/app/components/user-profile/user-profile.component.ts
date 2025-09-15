import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-container" [ngClass]="{'dark': isDarkMode}">
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
            <div class="progress-bar">
              <div class="progress-fill" style="width: 87.4%"></div>
            </div>
            <span class="progress-text">87.4% of annual goal</span>
          </div>
        </div>

        <!-- Dashboard Grid -->
        <div class="dashboard-grid">
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

          <!-- Budget Progress -->
          <div class="dashboard-section">
            <div class="section-header">
              <h3>Budget Progress</h3>
            </div>
            <div class="budget-list">
              <div class="budget-item">
                <div class="budget-info">
                  <h4>Office Expenses</h4>
                  <span class="budget-amounts">$1200 / $2000</span>
                </div>
                <div class="budget-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 60%"></div>
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
                    <div class="progress-fill" style="width: 56.3%"></div>
                  </div>
                  <span class="progress-stats">56.3% used • $350 remaining</span>
                </div>
              </div>
              
              <div class="budget-item">
                <div class="budget-info">
                  <h4>Marketing</h4>
                  <span class="budget-amounts">$800 / $1500</span>
                </div>
                <div class="budget-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 53.3%"></div>
                  </div>
                  <span class="progress-stats">53.3% used • $700 remaining</span>
                </div>
              </div>
              
              <div class="budget-item">
                <div class="budget-info">
                  <h4>Travel</h4>
                  <span class="budget-amounts">$300 / $1000</span>
                </div>
                <div class="budget-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 30%"></div>
                  </div>
                  <span class="progress-stats">30.0% used • $700 remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-grid">
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
            <div class="chart-placeholder">
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
              <div class="chart-months">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
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

    /* Balance Card */
    .balance-card {
      background-color: white;
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
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
      margin-bottom: 1rem;
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
      align-items: center;
      gap: 1rem;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background-color: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background-color: #10b981;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #6b7280;
      white-space: nowrap;
    }

    /* Dashboard Grid Layout */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

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
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
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

    /* Budget Progress */
    .budget-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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
      height: 6px;
      background-color: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .budget-progress .progress-fill {
      height: 100%;
      background-color: #3b82f6;
      transition: width 0.3s ease;
    }

    .progress-stats {
      font-size: 0.75rem;
      color: #6b7280;
    }

    /* Expense Breakdown */
    .expense-breakdown {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    /* Chart Placeholder */
    .chart-placeholder {
      padding: 2rem 0;
    }

    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .legend-color.income {
      background-color: #10b981;
    }

    .legend-color.expenses {
      background-color: #ef4444;
    }

    .chart-months {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 2rem;
    }

    /* Dark Mode Styles */
    .dark .dashboard-section {
      background-color: #1f2937;
    }

    .dark .section-header h3,
    .dark .transaction-info h4,
    .dark .budget-info h4,
    .dark .breakdown-percentage {
      color: #f9fafb;
    }

    .dark .breakdown-label span {
      color: #e5e7eb;
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

    /* Responsive Design */
    @media (max-width: 1024px) {
      .dashboard-grid,
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .action-btn {
        width: 100%;
        justify-content: center;
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
        align-items: stretch;
        gap: 0.5rem;
      }
    }

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

    /* Dark Mode Styles for Quick Actions */
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
    .dark .balance-card {
      background-color: #1f2937;
    }

    .dark .metric-header h3,
    .dark .balance-header h3 {
      color: #9ca3af;
    }

    .dark .metric-value,
    .dark .balance-value {
      color: #f9fafb;
    }

    .dark .metric-subtitle,
    .dark .balance-goal,
    .dark .progress-text {
      color: #6b7280;
    }

    .dark .progress-bar {
      background-color: #374151;
    }

    .dark .welcome-section h2 {
      color: #f9fafb;
    }

    .dark .subtitle {
      color: #9ca3af;
    }

    .dark .quick-actions {
      background-color: #1f2937;
    }

    .dark .quick-actions h2 {
      color: #f9fafb;
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

    /* Responsive Adjustments */
    @media (max-width: 768px) {
      .action-buttons {
        flex-direction: column;
      }
      
      .action-btn {
        width: 100%;
        justify-content: center;
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
}
