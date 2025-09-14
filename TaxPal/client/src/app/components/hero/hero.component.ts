import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-section">
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
    }
    p {
      font-size: 1.125rem;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 2rem;
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
      transition: background-color 0.2s, border-color 0.2s;
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
    }
  `]
})
export class HeroComponent { }
