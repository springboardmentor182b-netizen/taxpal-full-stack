import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-profile-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
            <a routerLink="/user-profile" class="nav-link" [class.active]="isActiveRoute('/user-profile')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <rect x="3" y="3" width="7" height="9"/>
                <rect x="14" y="3" width="7" height="5"/>
                <rect x="14" y="12" width="7" height="9"/>
                <rect x="3" y="16" width="7" height="5"/>
              </svg>
              <span>Dashboard</span>
            </a>
            <a routerLink="/transactions" class="nav-link" [class.active]="isActiveRoute('/transactions')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <rect x="2" y="3" width="20" height="18" rx="2"/>
                <path d="M7 8h10"/>
                <path d="M7 13h10"/>
                <path d="M7 18h4"/>
              </svg>
              <span>Transactions</span>
            </a>
            <a routerLink="/budget" class="nav-link" [class.active]="isActiveRoute('/budget')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 12h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 6v2"/>
                <path d="M12 16v2"/>
              </svg>
              <span>Budget</span>
            </a>
            <a routerLink="/reports" class="nav-link" [class.active]="isActiveRoute('/reports')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/>
                <path d="M16 13H8"/>
                <path d="M16 17H8"/>
                <path d="M10 9H8"/>
              </svg>
              <span>Reports</span>
            </a>
            <a routerLink="/tax-estimator" class="nav-link" [class.active]="isActiveRoute('/tax-estimator')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M7 15h0"/>
                <path d="M12 15h0"/>
                <path d="M17 15h0"/>
                <path d="M7 8h10"/>
              </svg>
              <span style="white-space: nowrap;">Tax Estimator</span>
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
            <button class="logout-btn" (click)="logout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
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
      overflow: hidden;
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
      font-size: 0.95rem;
      transition: color 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .nav-icon {
      stroke: #4b5563;
      transition: stroke 0.3s ease;
      width: 16px;
      height: 16px;
    }
    
    .nav-link:hover .nav-icon {
      stroke: #3b82f6;
    }
    
    .nav-link span {
      white-space: nowrap;
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
    
    .nav-link.active {
      color: #3b82f6;
    }
    
    .nav-link.active .nav-icon {
      stroke: #3b82f6;
    }
    
    .nav-link.active::before {
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
      right: 2rem;
    }
    
    .theme-toggle-btn, .logout-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      color: #4b5563;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    .theme-toggle-btn {
      padding: 0.5rem;
      width: 36px;
      height: 36px;
      gap: 0;
    }
    
    .theme-toggle-btn:hover, .logout-btn:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .logout-btn:hover {
      color: #ef4444;
    }
    
    .logout-btn svg {
      stroke: currentColor;
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
    
    .dark .nav-link.active {
      color: #60a5fa;
    }
    
    .dark .nav-link.active .nav-icon {
      stroke: #60a5fa;
    }
    
    .dark .theme-toggle-btn, .dark .logout-btn {
      color: #e5e7eb;
    }
    
    .dark .theme-toggle-btn:hover, .dark .logout-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .dark .logout-btn:hover {
      color: #f87171;
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
    
    /* Logout button styles */
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 6px;
      background-color: transparent;
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout-btn svg {
      stroke: #ef4444;
    }

    .logout-btn:hover {
      background-color: rgba(239, 68, 68, 0.1);
    }

    /* Dark mode styles */
    .dark .logout-btn {
      color: #f87171;
      border-color: rgba(248, 113, 113, 0.3);
    }

    .dark .logout-btn svg {
      stroke: #f87171;
    }

    .dark .logout-btn:hover {
      background-color: rgba(248, 113, 113, 0.1);
    }
  `]
})
export class ProfileNavbarComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  floatingEmojis: { symbol: string, style: any }[] = [];
  private emojis = ['💰', '💵', '💸', '💲', '💸', '💸'];
  private maxEmojis = 15;
  private animationInterval: any;
  
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
    
    // Apply dark mode if needed on component init
    if (this.isDarkMode) {
      setTimeout(() => {
        this.applyDarkMode();
      }, 100);
    }
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
    
    setTimeout(() => {
      this.applyDarkMode();
    }, 0);
    
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  private applyDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('darkModeChanged', { 
      detail: { isDarkMode: this.isDarkMode } 
    }));
  }
  
  logout() {
    // Clear user data from localStorage
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    
    // Navigate to home page
    window.location.href = '/';
  }
  
  isActiveRoute(route: string): boolean {
    return window.location.pathname === route;
  }
}