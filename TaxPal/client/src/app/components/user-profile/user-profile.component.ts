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
        <!-- Welcome Section -->
        <div class="welcome-section">
          <h1>Welcome back, Sam</h1>
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
    
    .welcome-section {
      margin-bottom: 3rem;
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

    /* New Income and Expense Buttons */
    .income-btn {
      background-color: #10b981;
      border-color: #059669;
      color: white;
    }

    .income-btn:hover {
      background-color: #059669;
      border-color: #047857;
    }

    .expense-btn {
      background-color: #ef4444;
      border-color: #dc2626;
      color: white;
    }

    .expense-btn:hover {
      background-color: #dc2626;
      border-color: #b91c1c;
    }

    /* Dark mode adjustments for new buttons */
    .dark .income-btn {
      background-color: #059669;
      border-color: #047857;
    }

    .dark .income-btn:hover {
      background-color: #047857;
      border-color: #065f46;
    }

    .dark .expense-btn {
      background-color: #dc2626;
      border-color: #b91c1c;
    }

    .dark .expense-btn:hover {
      background-color: #b91c1c;
      border-color: #991b1b;
    }

    /* Dark Mode Styles */
    .dark .metric-card {
      background-color: #1f2937;
    }

    .dark .metric-content h3 {
      color: #9ca3af;
    }

    .dark .metric-value {
      color: #f9fafb;
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

    /* Responsive Adjustments */
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
