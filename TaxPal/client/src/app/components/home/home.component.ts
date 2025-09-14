import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container" [ngClass]="{'dark': isDarkMode}">
      <div class="hero-section">
        <h1>Welcome to TaxPal</h1>
        <p class="subtitle">Simplify your tax management with our comprehensive platform</p>
        <div class="cta-buttons">
          <a routerLink="/user-profile" class="cta-button primary">Go to Dashboard</a>
          <a href="#features" class="cta-button secondary">Learn More</a>
        </div>
      </div>
      
      <div class="features-section" id="features">
        <h2>Why Choose TaxPal?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>User-Friendly Interface</h3>
            <p>Navigate through your tax information with our intuitive dashboard.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3>Track Your Transactions</h3>
            <p>Keep all your financial transactions organized in one place.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 12h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 6v2"/>
                <path d="M12 16v2"/>
              </svg>
            </div>
            <h3>Budget Management</h3>
            <p>Create and maintain budgets to help manage your finances better.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <h3>Detailed Reports</h3>
            <p>Generate comprehensive reports to understand your financial health.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: calc(100vh - 80px);
      background-color: #f9fafb;
      transition: background-color 0.3s ease;
    }
    
    .hero-section {
      padding: 6rem 2rem;
      text-align: center;
      background: linear-gradient(135deg, #ebf5ff 0%, #f0f9ff 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    h1 {
      font-size: 3rem;
      font-weight: 800;
      color: #1f2937;
      margin-bottom: 1.5rem;
    }
    
    .subtitle {
      font-size: 1.25rem;
      color: #4b5563;
      max-width: 600px;
      margin: 0 auto 2.5rem;
    }
    
    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    .cta-button {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .primary {
      background-color: #3b82f6;
      color: white;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
    }
    
    .primary:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 6px 10px -1px rgba(59, 130, 246, 0.3);
    }
    
    .secondary {
      background-color: white;
      color: #3b82f6;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .secondary:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .features-section {
      padding: 5rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background-color: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      padding: 2rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    .feature-icon {
      background-color: #ebf5ff;
      color: #3b82f6;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.75rem;
    }
    
    .feature-card p {
      color: #6b7280;
      line-height: 1.5;
    }
    
    /* Dark mode styles */
    .dark {
      background-color: #111827;
    }
    
    .dark .hero-section {
      background: linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%);
    }
    
    .dark h1 {
      color: #f9fafb;
    }
    
    .dark .subtitle {
      color: #d1d5db;
    }
    
    .dark .secondary {
      background-color: #1f2937;
      color: #60a5fa;
      border-color: #374151;
    }
    
    .dark .secondary:hover {
      border-color: #60a5fa;
    }
    
    .dark h2 {
      color: #f9fafb;
    }
    
    .dark .feature-card {
      background-color: #1f2937;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }
    
    .dark .feature-icon {
      background-color: #1e3a8a;
      color: #60a5fa;
    }
    
    .dark h3 {
      color: #f9fafb;
    }
    
    .dark .feature-card p {
      color: #9ca3af;
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 2.5rem;
      }
      
      .subtitle {
        font-size: 1.1rem;
      }
      
      .cta-buttons {
        flex-direction: column;
        width: 100%;
        max-width: 300px;
      }
      
      .features-section {
        padding: 4rem 1.5rem;
      }
    }
    
    @media (max-width: 640px) {
      h1 {
        font-size: 2rem;
      }
      
      h2 {
        font-size: 1.75rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
      
      .hero-section {
        padding: 4rem 1.5rem;
      }
    }
  `]
})
export class HomeComponent {
  isDarkMode = document.documentElement.classList.contains('dark');
}
