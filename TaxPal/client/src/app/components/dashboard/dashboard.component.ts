import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="dashboard-container" [ngClass]="{'dark': isDarkMode}">
      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Welcome to your TaxPal Dashboard</h1>
          <p class="subtitle">You're now logged in to your account. Here you can manage your taxes and finances.</p>
        </div>
        
        <div class="dashboard-placeholder">
          <div class="placeholder-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
          </div>
          <h2>Your dashboard is being set up</h2>
          <p>We're preparing your personalized tax dashboard. Check back soon for updates.</p>
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
    
    .dashboard-placeholder {
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
    
    .dashboard-placeholder p {
      color: #6b7280;
      max-width: 500px;
      margin: 0 auto;
    }
    
    /* Dark mode styles */
    .dashboard-container.dark {
      background-color: #111827;
    }
    
    .dark h1 {
      color: #f9fafb;
    }
    
    .dark .subtitle {
      color: #9ca3af;
    }
    
    .dark .dashboard-placeholder {
      background-color: #1f2937;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }
    
    .dark .placeholder-icon {
      color: #60a5fa;
    }
    
    .dark h2 {
      color: #e5e7eb;
    }
    
    .dark .dashboard-placeholder p {
      color: #9ca3af;
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
      
      .dashboard-placeholder {
        padding: 3rem 1.5rem;
      }
      
      h2 {
        font-size: 1.25rem;
      }
    }
  `]
})
export class DashboardComponent {
  isDarkMode = document.documentElement.classList.contains('dark');
}
