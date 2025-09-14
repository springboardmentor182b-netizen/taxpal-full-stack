import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <a routerLink="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="calculator-icon">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" x2="16" y1="6" y2="6" />
              <line x1="8" x2="16" y1="10" y2="10" />
              <line x1="8" x2="16" y1="14" y2="14" />
              <line x1="8" x2="16" y1="18" y2="18" />
            </svg>
            <span>TaxPal</span>
          </a>
        </div>
        <div class="nav-links">
          <a routerLink="/features" class="nav-link">
            <span>Features</span>
          </a>
          <a routerLink="/plan" class="nav-link">
            <span>Plan</span>
          </a>
          <a routerLink="/pricing" class="nav-link">
            <span>Pricing</span>
          </a>
          <a routerLink="/about" class="nav-link">
            <span>About</span>
          </a>
        </div>
        <div class="auth-buttons">
          <a routerLink="/login" class="login-btn">Log in</a>
          <a routerLink="/register" class="register-btn">Get started</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid rgba(229, 231, 235, 0.8);
      transition: all 0.3s ease;
    }
    
    .navbar:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .logo a {
      display: flex;
      align-items: center;
      font-weight: 700;
      font-size: 1.6rem;
      color: #3b82f6;
      text-decoration: none;
      transition: all 0.3s ease;
      letter-spacing: -0.5px;
    }
    
    .logo a:hover {
      transform: scale(1.05);
      color: #2563eb;
    }
    
    .calculator-icon {
      margin-right: 0.75rem;
      stroke: #3b82f6;
      transition: transform 0.4s ease, stroke 0.3s ease;
    }
    
    .logo a:hover .calculator-icon {
      transform: rotate(10deg);
      stroke: #2563eb;
    }
    
    .nav-links {
      display: flex;
      gap: 2.5rem;
      margin: 0 1rem;
    }
    
    .nav-link {
      position: relative;
      color: #4b5563;
      text-decoration: none;
      font-weight: 500;
      padding: 0.75rem 0;
      font-size: 1.05rem;
      transition: color 0.3s ease;
    }
    
    .nav-link span {
      position: relative;
      z-index: 1;
    }
    
    .nav-link::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #3b82f6;
      transition: width 0.3s ease;
      border-radius: 2px;
    }
    
    .nav-link:hover {
      color: #3b82f6;
    }
    
    .nav-link:hover::before {
      width: 100%;
    }
    
    .auth-buttons {
      display: flex;
      gap: 1.25rem;
      align-items: center;
    }
    
    .login-btn {
      color: #4b5563;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      transition: all 0.3s ease;
    }
    
    .login-btn:hover {
      color: #3b82f6;
      background-color: rgba(59, 130, 246, 0.05);
    }
    
    .register-btn {
      background-color: #3b82f6;
      color: white;
      padding: 0.6rem 1.25rem;
      border-radius: 0.375rem;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
      border: 1px solid rgba(59, 130, 246, 0.1);
    }
    
    .register-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transition: left 0.8s ease;
    }
    
    .register-btn:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    
    .register-btn:active {
      transform: translateY(1px);
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    }
    
    .register-btn:hover::before {
      left: 100%;
    }
    
    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
      }
      
      .nav-links {
        gap: 1.5rem;
      }
      
      .auth-buttons {
        gap: 0.75rem;
      }
    }
    
    @media (max-width: 640px) {
      .nav-links {
        display: none;
      }
      
      .logo a {
        font-size: 1.4rem;
      }
    }
  `]
})
export class NavbarComponent { }
