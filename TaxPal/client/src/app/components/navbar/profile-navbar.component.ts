import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
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
            <div class="profile-dropdown">
              <button type="button" class="profile-avatar" (click)="openMenu($event)">
                <span>S</span>
              </button>
              
              <!-- Simplified profile menu dropdown -->
              <div class="profile-menu-dropdown" *ngIf="showProfileMenu" (click)="$event.stopPropagation()">
                <div class="profile-section">
                  <div class="profile-info centered-profile">
                    <h3>Sam Johnson</h3>
                    <p>sam.johnson@example.com</p>
                  </div>
                </div>
                <div class="profile-menu-divider"></div>
                <div class="profile-menu-items">
                  <a routerLink="/profile-settings" class="profile-menu-item" (click)="closeMenu()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span>Profile Settings</span>
                  </a>
                  <div class="profile-menu-divider"></div>
                  <a routerLink="/" class="profile-menu-item logout-item" (click)="logoutAndClose($event)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Backdrop overlay when menu is open -->
    <div class="menu-backdrop" *ngIf="showProfileMenu" (click)="closeMenu()"></div>
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
      right: -1rem;
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
    
    .dark .nav-link.active {
      color: #60a5fa;
    }
    
    .dark .nav-link.active .nav-icon {
      stroke: #60a5fa;
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
    
    /* User profile indicator styles */
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
    
    /* Floating emoji animation */
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
    
    /* Media queries */
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
      
      .user-profile-indicator {
        margin-right: 1rem;
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
      
      .user-profile-indicator {
        padding: 0.4rem 0.6rem;
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
      
      .user-profile-indicator {
        margin-right: 0.5rem;
      }
      
      .user-name {
        display: none;
      }
    }
    
    /* Fix for Tax Estimator text */
    .nav-link span {
      white-space: nowrap;
      position: relative;
      z-index: 1;
    }
    
    /* Simple Profile Menu Overlay */
    .profile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999999;
    }
    
    .profile-menu-container {
      width: 280px;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    .dark .profile-menu-container {
      background-color: #1f2937;
    }
    
    .profile-menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .dark .profile-menu-header {
      border-bottom-color: #374151;
    }
    
    .profile-menu-header span {
      font-weight: 600;
      color: #111827;
    }
    
    .dark .profile-menu-header span {
      color: #f9fafb;
    }
    
    .close-menu-btn {
      background: none;
      border: none;
      font-size: 24px;
      line-height: 1;
      color: #6b7280;
      cursor: pointer;
    }
    
    .close-menu-btn:hover {
      color: #111827;
    }
    
    .dark .close-menu-btn:hover {
      color: #f9fafb;
    }
    
    .profile-menu-items {
      padding: 10px 0;
    }
    
    .profile-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      color: #4b5563;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    
    .profile-menu-item:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }
    
    .dark .profile-menu-item {
      color: #e5e7eb;
    }
    
    .dark .profile-menu-item:hover {
      background-color: #374151;
      color: #f9fafb;
    }
    
    .profile-menu-divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 5px 0;
    }
    
    .dark .profile-menu-divider {
      background-color: #374151;
    }
    
    /* Profile Avatar Styles */
    .profile-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #3b82f6;
      color: #ffffff;
      font-weight: 600;
      font-size: 0.9rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    }
    
    .profile-avatar:hover {
      background-color: #60a5fa;
      color: #111827;
      box-shadow: 0 2px 4px rgba(96, 165, 250, 0.3);
    }
    
    .dark .profile-avatar:hover {
      background-color: #93c5fd;
      box-shadow: 0 4px 6px rgba(96, 165, 250, 0.4);
    }
    
    /* Profile dropdown positioning */
    .profile-dropdown {
      position: relative;
      margin-right: 2rem;
      z-index: 99999; /* Increased z-index */
    }
    
    /* Repositioned menu dropdown with better alignment */
    .profile-menu-dropdown {
      position: fixed;
      top: 70px; /* Slightly higher for better positioning */
      right: 2rem;
      width: 300px;
      background-color: white;
      border-radius: 10px;
      overflow: visible;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1);
      z-index: 999999;
      animation: dropdown-appear 0.25s cubic-bezier(0.23, 1, 0.32, 1);
      transform-origin: top right;
    }
    
    /* Ensure backdrop is above hero section */
    .menu-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99998; /* Just below dropdown but above everything else */
      background-color: rgba(0, 0, 0, 0.2); /* Slight darkening */
    }
    
    /* Additional style to ensure menu appearance */
    .profile-menu-dropdown::before {
      content: '';
      position: absolute;
      top: -8px;
      right: 12px;
      width: 16px;
      height: 16px;
      background-color: white;
      transform: rotate(45deg);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      border-left: 1px solid rgba(0, 0, 0, 0.05);
      z-index: -1;
    }
    
    .dark .profile-menu-dropdown::before {
      background-color: #1f2937;
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    /* Make all other elements work with the dropdown */
    body {
      position: relative;
    }
    
    /* Updated animation for better appearance */
    @keyframes dropdown-appear {
      from { opacity: 0; transform: translateY(-8px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    /* Centered profile info without avatar duplication */
    .centered-profile {
      text-align: center;
      padding: 1.25rem 1rem;
      width: 100%;
    }
    
    .centered-profile h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #111827;
    }
    
    .centered-profile p {
      margin: 0;
      font-size: 0.9rem;
      color: #6b7280;
    }
    
    .dark .centered-profile h3 {
      color: #f9fafb;
    }
    
    .dark .centered-profile p {
      color: #9ca3af;
    }
    
    /* Enhanced logout item */
    .logout-item {
      color: #ef4444 !important; /* Red color for logout */
    }
    
    .logout-item svg {
      color: #ef4444 !important;
      stroke: #ef4444 !important;
    }
    
    .dark .logout-item {
      color: #f87171 !important;
    }
    
    .dark .logout-item svg {
      color: #f87171 !important;
      stroke: #f87171 !important;
    }
    
    .logout-item:hover {
      background-color: rgba(239, 68, 68, 0.1) !important;
    }
    
    .dark .logout-item:hover {
      background-color: rgba(248, 113, 113, 0.1) !important;
    }
    
    /* Fix for dropdown alignment and top section */
    .profile-section {
      padding: 0; /* Remove default padding */
    }
    
    /* Improved dropdown menu */
    .profile-menu-dropdown {
      position: fixed;
      top: 70px;
      right: 2rem;
      width: 270px; /* Smaller width for better proportions */
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1);
      z-index: 999999;
      animation: dropdown-appear 0.2s ease;
    }
  `]
})
export class ProfileNavbarComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  floatingEmojis: { symbol: string, style: any }[] = [];
  private emojis = ['💰', '💵', '💸', '💲', '💸', '💸'];
  private maxEmojis = 15;
  private animationInterval: any;
  showProfileMenu = false;

  constructor(private router: Router, private renderer: Renderer2, private elementRef: ElementRef) {
    // Check for saved preference on component initialization
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.isDarkMode = true;
      this.applyDarkMode();
    }
  }

  ngOnInit() {
    this.startEmojiAnimation();
    
    // Add global click handler to close menu when clicking outside
    this.renderer.listen('document', 'click', (event) => {
      if (this.showProfileMenu && 
          !this.elementRef.nativeElement.querySelector('.profile-menu-dropdown')?.contains(event.target) &&
          !this.elementRef.nativeElement.querySelector('.profile-avatar')?.contains(event.target)) {
        this.closeMenu();
      }
    });
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  // Remove all other toggle methods and keep only these clean, simple methods
  openMenu(event: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    this.showProfileMenu = true;
    document.body.style.overflow = 'auto';
  }

  closeMenu() {
    this.showProfileMenu = false;
    document.body.style.overflow = '';
  }

  logoutAndClose(event: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    this.closeMenu();
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Navigate to home with force reload to ensure complete reset
    window.location.href = '/';
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
  
  isActiveRoute(route: string): boolean {
    return window.location.pathname === route;
  }
}
