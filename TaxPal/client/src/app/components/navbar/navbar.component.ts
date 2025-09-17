import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { SignInFormComponent } from '../auth/sign-in-form.component';
import { SignUpFormComponent } from '../auth/sign-up-form.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, SignInFormComponent, SignUpFormComponent],
  template: `
    <nav class="navbar" [ngClass]="{ 'dark': isDarkMode }">
      <div class="navbar-box" [ngClass]="{ 'dark': isDarkMode }">
        <div class="floating-emoji" *ngFor="let emoji of floatingEmojis" [ngStyle]="emoji.style">
          {{ emoji.symbol }}
        </div>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>Features</span>
            </a>
            <a routerLink="/plan" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Plan</span>
            </a>
            <a routerLink="/support" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Support</span>
            </a>
            <a routerLink="/about" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>About</span>
            </a>
          </div>
          <div class="right-container">
            <button class="theme-toggle-btn" [ngClass]="{ 'dark': isDarkMode }" aria-label="Toggle dark mode" (click)="toggleDarkMode()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon sun-icon">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon moon-icon">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
            <div class="auth-buttons" *ngIf="!isProfilePage">
              <a class="login-btn btn" (click)="openSignInForm($event)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="login-icon">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                <span>Sign in</span>
              </a>
              <a class="register-btn btn" (click)="openSignUpForm($event)">Get started</a>
            </div>
            <div class="user-profile-indicator" *ngIf="isProfilePage">
              <div class="user-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span class="user-name">User Account</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <app-sign-in-form 
      *ngIf="showSignInForm" 
      (close)="closeAuthForms()"
      (switchToSignUp)="switchToSignUp()"
    ></app-sign-in-form>
    
    <app-sign-up-form 
      *ngIf="showSignUpForm" 
      (close)="closeAuthForms()"
      (switchToSignIn)="switchToSignIn()"
    ></app-sign-up-form>
  `,
  styles: [`
    .navbar {
      background-color: #ffffff;
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      width: 100%;
      overflow-x: hidden;
    }
    
    .navbar-box {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      color: #000000;
      padding: 1.25rem 0;
      width: 100%;
      border-bottom: 1px solid #e5e7eb;
      position: relative;
      overflow: hidden;  /* Contain the floating emojis */
    }
    
    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      padding: 0;
      position: relative;
      margin: 0 auto;
    }
    
    .logo {
      flex: 0 0 auto;
      margin-right: 2rem;
      margin-left: 2rem;
    }
    
    .logo a {
      display: flex;
      align-items: center;
      font-weight: 700;
      font-size: 1.6rem;
      color: #000000;
      text-decoration: none;
      transition: all 0.3s ease;
      letter-spacing: -0.5px;
    }
    
    .logo a:hover {
      transform: scale(1.05);
      color: #3b82f6;
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
      margin: 0 auto;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      justify-content: center;
    }
    
    .nav-link {
      position: relative;
      color: #1f2937;
      text-decoration: none;
      font-weight: 500;
      padding: 0.75rem 0;
      font-size: 0.95rem;  /* Reduced from 1.05rem */
      transition: color 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .nav-icon {
      stroke: #4b5563;
      transition: stroke 0.3s ease;
      width: 16px;  /* Reduced from 18px */
      height: 16px;  /* Reduced from 18px */
    }
    
    .nav-link:hover .nav-icon {
      stroke: #3b82f6;
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
    
    .right-container {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-left: auto;
      padding-left: 1rem;
      flex: 0 0 auto;
      position: absolute;
      right: -1rem;
    }
    
    .auth-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-shrink: 0;
      border-left: 1px solid #e5e7eb;
      padding-left: 1.5rem;
      padding-right: 2rem;
    }
    
    .dark .auth-buttons {
      border-left-color: #374151;
    }
    
    .theme-toggle-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border-radius: 50%;
      transition: background-color 0.3s ease;
      position: relative;
      width: 36px;
      height: 36px;
      flex-shrink: 0; /* Prevent shrinking */
    }
    
    .theme-toggle-btn:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .theme-icon {
      stroke: #4b5563;
      transition: stroke 0.3s ease, transform 0.5s ease;
    }
    
    .theme-toggle-btn:hover .theme-icon {
      stroke: #3b82f6;
    }
    
    .moon-icon {
      position: absolute;
      opacity: 0;
      transform: rotate(-30deg) scale(0);
    }
    
    .sun-icon {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
    
    /* When the dark mode is active */
    .dark-mode .moon-icon {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
    
    .dark-mode .sun-icon {
      opacity: 0;
      transform: rotate(30deg) scale(0);
    }
    
    /* Dark mode styles */
    .navbar.dark {
      background-color: #111827;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    .navbar-box.dark {
      background-color: #111827;
      color: #f9fafb;
      border-bottom: 1px solid #1f2937;
    }
    
    .dark .logo a {
      color: #f9fafb;
    }
    
    .dark .calculator-icon {
      stroke: #60a5fa;
    }
    
    .dark .logo a:hover {
      color: #60a5fa;
    }
    
    .dark .logo a:hover .calculator-icon {
      stroke: #93c5fd;
    }
    
    .dark .nav-link {
      color: #e5e7eb;
    }
    
    .dark .nav-icon {
      stroke: #9ca3af;
    }
    
    .dark .nav-link:hover {
      color: #60a5fa;
    }
    
    .dark .nav-link:hover .nav-icon {
      stroke: #60a5fa;
    }
    
    .dark .nav-link::before {
      background-color: #60a5fa;
    }
    
    .dark .theme-toggle-btn {
      background-color: transparent;
    }
    
    .dark .theme-toggle-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .dark .theme-icon {
      stroke: #9ca3af;
    }
    
    .dark .theme-toggle-btn:hover .theme-icon {
      stroke: #60a5fa;
    }
    
    .dark .moon-icon {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
    
    .dark .sun-icon {
      opacity: 0;
      transform: rotate(30deg) scale(0);
    }
    
    .dark .login-btn {
      background-color: #60a5fa;
      color: #111827;
      box-shadow: 0 2px 4px rgba(96, 165, 250, 0.3);
    }
    
    .dark .login-icon {
      stroke: #111827;
    }
    
    .dark .login-btn:hover {
      background-color: #93c5fd;
      box-shadow: 0 4px 8px rgba(96, 165, 250, 0.4);
    }
    
    .dark .register-btn {
      background-color: #60a5fa;
      color: #111827;
      box-shadow: 0 2px 4px rgba(96, 165, 250, 0.3);
    }
    
    .dark .register-btn:hover {
      background-color: #93c5fd;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(96, 165, 250, 0.4);
    }
    
    .dark .register-btn:active {
      transform: translateY(1px);
      box-shadow: 0 2px 4px rgba(96, 165, 250, 0.3);
    }
    
    .btn {
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.5rem 1.1rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      white-space: nowrap;
      flex-shrink: 0;
    }
    
    .login-btn {
      background-color: #3b82f6;
      color: #ffffff;
      border: none;
      gap: 0.5rem;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    }
    
    .login-icon {
      stroke: #ffffff;
      transition: stroke 0.3s ease;
      width: 16px;
      height: 16px;
      margin-right: 0.25rem;
      position: relative;
      top: 0;
      flex-shrink: 0;
    }
    
    .login-btn:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
    }
    
    .login-btn:active {
      transform: translateY(1px);
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    }
    
    .register-btn {
      background-color: #3b82f6;
      color: #ffffff;
      font-weight: 600;
      position: relative;
      overflow: hidden;
      border: none;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
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
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
    }
    
    .register-btn:active {
      transform: translateY(1px);
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    }
    
    .register-btn:hover::before {
      left: 100%;
    }
    
    @media (max-width: 1024px) {
      .nav-links {
        position: static;
        transform: none;
        margin: 0 auto;
        justify-content: center;
        gap: 2rem;
      }
      
      .navbar-container {
        justify-content: space-between;
      }
      
      .right-container {
        position: static;
        right: auto;
      }
      
      .auth-buttons {
        padding-right: 1rem;
      }
      
      .logo {
        margin-left: 1rem;
      }
    }
    
    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
      }
      
      .navbar-box {
        padding: 1rem 1.5rem;
      }
      
      .nav-links {
        gap: 1.5rem;
      }
      
      .right-container {
        gap: 1rem;
      }
      
      .auth-buttons {
        padding-right: 1rem;
      }
      
      .btn {
        padding: 0.45rem 0.9rem;
        font-size: 0.9rem;
      }
      
      .login-btn {
        padding: 0.45rem 0.9rem;
      }
      
      .login-btn span {
        display: inline; /* Show text on medium screens */
      }
    }
    
    @media (max-width: 640px) {
      .nav-links {
        display: none;
      }
      
      .logo a {
        font-size: 1.4rem;
      }
      
      .navbar-box {
        padding: 0.75rem 0;
      }
      
      .theme-toggle-btn {
        width: 32px;
        height: 32px;
        padding: 0.4rem;
      }
      
      .register-btn {
        font-size: 0.85rem;
        padding: 0.4rem 0.8rem;
      }
      
      .right-container {
        gap: 0.75rem;
      }
      
      .auth-buttons {
        padding-right: 0.5rem;
      }
      
      .login-btn span {
        display: none; /* Hide text on smaller screens */
      }
      
      .login-btn {
        padding: 0.45rem;
      }
      
      .login-icon {
        margin-right: 0;
      }
    }
    
    .floating-emoji {
      position: absolute;
      font-size: 1.5rem;
      opacity: 0;
      z-index: 1;
      pointer-events: none;
      animation: float 8s linear forwards;
      transform: translateZ(0);
      will-change: transform, opacity, top, left;
    }
    
    @keyframes float {
      0% {
        opacity: 0;
        transform: translateY(0) rotate(0deg) scale(0.8);
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: translateY(-100px) rotate(360deg) scale(1.2);
      }
    }
    
    .dark .floating-emoji {
      filter: brightness(1.2);
    }
    
    .user-profile-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      background-color: #f3f4f6;
      margin-right: 2rem;
      transition: all 0.3s ease;
    }
    
    .dark .user-profile-indicator {
      background-color: #374151;
    }
    
    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #e5e7eb;
      color: #4b5563;
    }
    
    .dark .user-avatar {
      background-color: #4b5563;
      color: #e5e7eb;
    }
    
    .user-name {
      font-weight: 500;
      color: #4b5563;
      font-size: 0.9rem;
    }
    
    .dark .user-name {
      color: #e5e7eb;
    }
    
    @media (max-width: 640px) {
      .user-profile-indicator {
        margin-right: 0.5rem;
        padding: 0.4rem 0.6rem;
      }
      
      .user-avatar {
        width: 28px;
        height: 28px;
      }
      
      .user-name {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  floatingEmojis: { symbol: string, style: any }[] = [];
  private emojis = ['💰', '💵', '💸', '💲', '💸', '💸'];
  private maxEmojis = 15;
  private animationInterval: any;
  showSignInForm = false;
  showSignUpForm = false;
  isProfilePage = false;

  constructor(private router: Router) {
    // Check for saved preference on component initialization
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.isDarkMode = true;
      this.applyDarkMode();
    }
  }

  ngOnInit() {
    this.startEmojiAnimation();
    
    // Subscribe to router events to detect when we're on a profile page
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.isProfilePage = url.includes('/user-profile') || 
                            url.includes('/transactions') || 
                            url.includes('/budget') || 
                            url.includes('/reports') || 
                            url.includes('/tax-estimator');
      }
    });
    
    // Check initial URL
    const currentUrl = this.router.url;
    this.isProfilePage = currentUrl.includes('/user-profile') || 
                        currentUrl.includes('/transactions') || 
                        currentUrl.includes('/budget') || 
                        currentUrl.includes('/reports') || 
                        currentUrl.includes('/tax-estimator');
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  private startEmojiAnimation() {
    this.animationInterval = setInterval(() => {
      // Only add new emoji if we haven't reached the max
      if (this.floatingEmojis.length < this.maxEmojis) {
        this.addFloatingEmoji();
      }
      
      // Remove completed animations
      this.floatingEmojis = this.floatingEmojis.filter(emoji => 
        Date.now() - emoji.style.createdAt < 8000
      );
    }, 800);
  }

  private addFloatingEmoji() {
    const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
    const left = Math.random() * 100; // Random horizontal position (0-100%)
    const rotationStart = Math.random() * 360; // Random initial rotation
    const scale = 0.8 + Math.random() * 0.4; // Random scale between 0.8 and 1.2
    const duration = 6 + Math.random() * 4; // Random duration between 6-10s
    
    this.floatingEmojis.push({
      symbol: randomEmoji,
      style: {
        left: `${left}%`,
        bottom: '-20px',
        transform: `rotate(${rotationStart}deg) scale(${scale})`,
        animationDuration: `${duration}s`,
        createdAt: Date.now()
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyDarkMode();
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  private applyDarkMode() {
    // Apply dark mode to document body for global styling
    if (document.body) {
      document.body.classList.toggle('dark-mode', this.isDarkMode);
    }
    
    // Apply dark mode to HTML element to allow for CSS variable targeting
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  openSignInForm(event: Event) {
    event.preventDefault();
    this.showSignInForm = true;
    this.showSignUpForm = false;
    document.body.classList.add('no-scroll');
  }

  openSignUpForm(event: Event) {
    event.preventDefault();
    this.showSignUpForm = true;
    this.showSignInForm = false;
    document.body.classList.add('no-scroll');
  }

  closeAuthForms() {
    this.showSignInForm = false;
    this.showSignUpForm = false;
    document.body.classList.remove('no-scroll');
  }
  
  switchToSignUp() {
    this.showSignInForm = false;
    this.showSignUpForm = true;
  }
  
  switchToSignIn() {
    this.showSignUpForm = false;
    this.showSignInForm = true;
  }
}

