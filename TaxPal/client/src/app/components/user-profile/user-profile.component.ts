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
        <div class="welcome-section">
          <h1>Welcome to your TaxPal {{ pageTitle }}</h1>
          <p class="subtitle">You're now logged in to your account. Here you can manage your taxes and finances.</p>
        </div>
        
        <div class="profile-placeholder">
          <div class="placeholder-icon">
            <svg *ngIf="currentRoute === 'user-profile'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="9"/>
              <rect x="14" y="3" width="7" height="5"/>
              <rect x="14" y="12" width="7" height="9"/>
              <rect x="3" y="16" width="7" height="5"/>
            </svg>
            <svg *ngIf="currentRoute === 'transactions'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="18" rx="2"/>
              <path d="M7 8h10"/>
              <path d="M7 13h10"/>
              <path d="M7 18h4"/>
            </svg>
            <svg *ngIf="currentRoute === 'budget'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 12h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
              <path d="M12 6v2"/>
              <path d="M12 16v2"/>
            </svg>
            <svg *ngIf="currentRoute === 'reports'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
              <path d="M10 9H8"/>
            </svg>
            <svg *ngIf="currentRoute === 'tax-estimator'" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M7 15h0"/>
              <path d="M12 15h0"/>
              <path d="M17 15h0"/>
              <path d="M7 8h10"/>
            </svg>
          </div>
          <h2>Your {{ pageTitle }} is being set up</h2>
          <p>We're preparing your personalized tax {{ currentRoute === 'user-profile' ? 'dashboard' : currentRoute }}. Check back soon for updates.</p>
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
    
    .profile-placeholder {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      padding: 4rem 2rem;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .placeholder-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
      color: #3b82f6;
    }
    
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }
    
    .profile-placeholder p {
      color: #6b7280;
      max-width: 500px;
      margin: 0 auto;
    }
    
    /* Dark mode styles */
    .profile-container.dark {
      background-color: #111827;
    }
    
    .dark h1 {
      color: #f9fafb;
    }
    
    .dark .subtitle {
      color: #9ca3af;
    }
    
    .dark .profile-placeholder {
      background-color: #1f2937;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }
    
    .dark .placeholder-icon {
      color: #60a5fa;
    }
    
    .dark h2 {
      color: #e5e7eb;
    }
    
    .dark .profile-placeholder p {
      color: #9ca3af;
    }
    
    @media (max-width: 768px) {
      .profile-content {
        padding: 2.5rem 1.5rem;
      }
    }
    
    @media (max-width: 640px) {
      .profile-content {
        padding: 2rem 1rem;
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
    // Determine current route
    const path = this.router.url.split('/')[1] || 'user-profile';
    this.currentRoute = path;
    
    // Set page title based on route
    switch (this.currentRoute) {
      case 'transactions':
        this.pageTitle = 'Transactions';
        break;
      case 'budget':
        this.pageTitle = 'Budget';
        break;
      case 'reports':
        this.pageTitle = 'Reports';
        break;
      case 'tax-estimator':
        this.pageTitle = 'Tax Estimator';
        break;
      default:
        this.pageTitle = 'Dashboard';
    }
  }
}
