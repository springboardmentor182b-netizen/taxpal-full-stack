import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container" [ngClass]="{'dark': isDarkMode}">
      <div class="profile-content">
        <div class="welcome-section">
          <h1>Welcome to your TaxPal Profile</h1>
          <p class="subtitle">You're now logged in to your account. Here you can manage your taxes and finances.</p>
        </div>
        
        <div class="profile-placeholder">
          <div class="placeholder-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2>Your profile is being set up</h2>
          <p>We're preparing your personalized tax profile. Check back soon for updates.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: calc(100vh - 80px);
      background-color: #f9fafb;
      padding: 3rem 1.5rem;
      transition: background-color 0.3s ease;
    }
    
    .profile-content {
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
    
    @media (max-width: 640px) {
      .profile-container {
        padding: 2rem 1rem;
      }
      
      h1 {
        font-size: 1.75rem;
      }
      
      .subtitle {
        font-size: 1rem;
      }
      
      .profile-placeholder {
        padding: 3rem 1.5rem;
      }
      
      h2 {
        font-size: 1.25rem;
      }
    }
  `]
})
export class UserProfileComponent {
  isDarkMode = document.documentElement.classList.contains('dark');
}
