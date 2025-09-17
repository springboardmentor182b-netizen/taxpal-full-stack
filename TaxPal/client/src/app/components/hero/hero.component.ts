import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-section" [ngClass]="{'dark-mode': isDarkMode()}">
      <div class="hero-content">
        <h1>Accounting made simple for freelancers</h1>
        <p>
          TaxPal helps freelancers stay on top of their finances, expenses, and taxes
          without the stress. Focus on your craft, we'll handle the numbers.
        </p>
        <div class="cta-buttons">
          <a routerLink="/register" class="get-started-btn">Get Started Today</a>
          <a routerLink="/demo" class="demo-btn">Request a Demo</a>
        </div>
      </div>
      <div class="hero-image">
        <div class="placeholder-image">
          <div class="image-placeholder">Tax Dashboard Preview</div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4rem;
      padding: 6rem 0;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    /* Dark mode for hero section */
    .hero-section.dark-mode, 
    :host-context(body.dark-mode) .hero-section,
    :host-context(body.dark) .hero-section {
      background-color: #111827;
    }
    
    :host-context(body.dark-mode) h1,
    :host-context(body.dark) h1,
    .hero-section.dark-mode h1 {
      color: #f9fafb;
    }
    
    :host-context(body.dark-mode) p,
    :host-context(body.dark) p,
    .hero-section.dark-mode p {
      color: #d1d5db;
    }
    
    :host-context(body.dark-mode) .demo-btn,
    :host-context(body.dark) .demo-btn,
    .hero-section.dark-mode .demo-btn {
      border-color: #4b5563;
      color: #e5e7eb;
    }
    
    :host-context(body.dark-mode) .demo-btn:hover,
    :host-context(body.dark) .demo-btn:hover,
    .hero-section.dark-mode .demo-btn:hover {
      background-color: #374151;
      border-color: #6b7280;
    }
    
    :host-context(body.dark-mode) .image-placeholder,
    :host-context(body.dark) .image-placeholder,
    .hero-section.dark-mode .image-placeholder {
      background-color: #1f2937;
      color: #9ca3af;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
    }
    
    @media (max-width: 768px) {
      .hero-section {
        flex-direction: column;
        padding: 3rem 0;
      }
    }
    
    .hero-content {
      flex: 1;
    }
    
    .hero-image {
      flex: 1;
    }
    
    h1 {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: #1a202c;
      transition: color 0.3s ease;
    }
    
    p {
      font-size: 1.125rem;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 2rem;
      transition: color 0.3s ease;
    }
    
    .cta-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .get-started-btn {
      background-color: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .get-started-btn:hover {
      background-color: #2563eb;
    }
    
    .demo-btn {
      border: 1px solid #d1d5db;
      color: #4b5563;
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s, border-color 0.2s, color 0.3s ease;
    }
    
    .demo-btn:hover {
      background-color: #f3f4f6;
      border-color: #9ca3af;
    }
    
    .image-placeholder {
      background-color: #f3f4f6;
      border-radius: 0.5rem;
      height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      font-weight: 500;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  private darkModeListener: any;
  
  ngOnInit() {
    // Check dark mode on init
    console.log('Hero component initialized, checking dark mode');
    
    // Listen for dark mode changes
    this.darkModeListener = () => {
      console.log('Dark mode change detected in hero component');
      // Force change detection by toggling a class
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.classList.add('dark-mode-updated');
        setTimeout(() => {
          heroSection.classList.remove('dark-mode-updated');
        }, 10);
      }
    };
    
    window.addEventListener('darkModeChanged', this.darkModeListener);
  }
  
  ngOnDestroy() {
    // Clean up event listener
    if (this.darkModeListener) {
      window.removeEventListener('darkModeChanged', this.darkModeListener);
    }
  }
  
  isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode') || 
           document.body.classList.contains('dark');
  }
}
