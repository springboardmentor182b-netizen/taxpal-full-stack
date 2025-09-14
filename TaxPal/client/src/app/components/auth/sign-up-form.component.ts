import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal($event)">
      <div class="modal-container" [ngClass]="{'dark': isDarkMode}">
        <div class="floating-emoji" *ngFor="let emoji of floatingEmojis" [ngStyle]="emoji.style">
          {{ emoji.symbol }}
        </div>
        
        <div class="modal-header">
          <div class="header-content">
            <h2>Start Your Free Account</h2>
            <p class="subtitle">Get instant access to all features - completely free, forever</p>
          </div>
          <button class="close-btn" (click)="closeForm()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First name</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                placeholder="John"
                [(ngModel)]="firstName"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="lastName">Last name</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                placeholder="Doe"
                [(ngModel)]="lastName"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="john.doe@example.com"
              [(ngModel)]="email"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password">Create a secure password</label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                name="password" 
                placeholder="•••••••••••••"
                [(ngModel)]="password"
                required
              >
              <button type="button" class="toggle-password" (click)="togglePasswordVisibility()">
                <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                  <line x1="2" x2="22" y1="2" y2="22"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="country">Select country</label>
            <div class="custom-select">
              <select 
                id="country" 
                name="country" 
                [(ngModel)]="country"
                required
              >
                <option value="" disabled selected>Select country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="au">Australia</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
                <option value="jp">Japan</option>
                <option value="in">India</option>
                <option value="br">Brazil</option>
                <option value="other">Other</option>
              </select>
              <div class="select-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
            <div class="form-hint" *ngIf="!country">Select country first</div>
          </div>
          
          <div class="form-group agreement-group">
            <label class="checkbox-container">
              <input type="checkbox" [(ngModel)]="agreeToTerms">
              <span class="checkmark"></span>
              I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a>
            </label>
          </div>
          
          <div class="form-group agreement-group">
            <label class="checkbox-container">
              <input type="checkbox" [(ngModel)]="receiveUpdates">
              <span class="checkmark"></span>
              Send me updates about new TaxPal features and tips
            </label>
          </div>
          
          <button 
            type="button" 
            class="sign-up-btn" 
            [disabled]="!isFormValid()" 
            (click)="createAccount()"
          >
            Create Free Account
          </button>
          
          <p class="sign-in-prompt">
            Already have an account? <a href="#" class="sign-in-link" (click)="onSwitchToSignIn($event)">Sign in instead</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
      padding: 2rem 1rem;
      overflow-y: auto;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .modal-container {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      width: 100%;
      max-width: 550px;
      margin: auto;
      animation: slideUp 0.3s ease;
      overflow: hidden;
      position: relative;
      max-height: calc(100vh - 4rem);
      display: flex;
      flex-direction: column;
    }
    
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .header-content {
      flex: 1;
    }
    
    .modal-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }
    
    .subtitle {
      font-size: 0.95rem;
      color: #6b7280;
      margin: 0;
    }
    
    .close-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #6b7280;
      padding: 0.5rem;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }
    
    .close-btn:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }
    
    .modal-body {
      padding: 2rem;
      overflow-y: auto;
    }
    
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .form-row .form-group {
      flex: 1;
      margin-bottom: 0;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    
    .form-group input, 
    .form-group select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      background-color: #ffffff;
    }
    
    .form-group input:focus, 
    .form-group select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
    
    .password-input {
      position: relative;
    }
    
    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.25rem;
    }
    
    .password-strength {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
    }
    
    .strength-bar {
      height: 4px;
      flex: 1;
      border-radius: 2px;
      background-color: #e5e7eb;
      position: relative;
      overflow: hidden;
    }
    
    .strength-bar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s ease, background-color 0.3s ease;
    }
    
    .strength-bar.weak::before {
      width: 33.33%;
      background-color: #ef4444;
    }
    
    .strength-bar.medium::before {
      width: 66.66%;
      background-color: #f59e0b;
    }
    
    .strength-bar.strong::before {
      width: 100%;
      background-color: #10b981;
    }
    
    .strength-text {
      font-size: 0.75rem;
      margin-left: 1rem;
      font-weight: 500;
    }
    
    .weak .strength-text {
      color: #ef4444;
    }
    
    .medium .strength-text {
      color: #f59e0b;
    }
    
    .strong .strength-text {
      color: #10b981;
    }
    
    .custom-select {
      position: relative;
    }
    
    .custom-select select {
      appearance: none;
      width: 100%;
      cursor: pointer;
    }
    
    .select-arrow {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #6b7280;
    }
    
    .form-hint {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.5rem;
    }
    
    .agreement-group {
      margin-bottom: 1rem;
    }
    
    .checkbox-container {
      display: flex;
      align-items: flex-start;
      cursor: pointer;
      font-size: 0.875rem;
      color: #4b5563;
      line-height: 1.5;
    }
    
    .checkbox-container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    .checkmark {
      position: relative;
      display: inline-block;
      height: 18px;
      width: 18px;
      min-width: 18px;
      background-color: #fff;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      margin-right: 0.75rem;
      margin-top: 0.15rem;
    }
    
    .checkbox-container:hover input ~ .checkmark {
      border-color: #3b82f6;
    }
    
    .checkbox-container input:checked ~ .checkmark {
      background-color: #3b82f6;
      border-color: #3b82f6;
    }
    
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    
    .checkbox-container input:checked ~ .checkmark:after {
      display: block;
    }
    
    .checkbox-container .checkmark:after {
      left: 6px;
      top: 3px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }
    
    .link:hover {
      text-decoration: underline;
    }
    
    .sign-up-btn {
      width: 100%;
      padding: 0.75rem 1.25rem;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.2s;
      margin-bottom: 1.5rem;
    }
    
    .sign-up-btn:hover:not(:disabled) {
      background-color: #2563eb;
      transform: translateY(-2px);
    }
    
    .sign-up-btn:active:not(:disabled) {
      transform: translateY(0);
    }
    
    .sign-up-btn:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
    
    .sign-in-prompt {
      text-align: center;
      font-size: 0.875rem;
      color: #4b5563;
      margin-top: 0;
      margin-bottom: 0;
    }
    
    .sign-in-link {
      color: #3b82f6;
      font-weight: 500;
      text-decoration: none;
    }
    
    .sign-in-link:hover {
      text-decoration: underline;
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
        transform: translateY(100px) rotate(360deg) scale(1.2);
      }
    }
    
    /* Dark mode styles */
    .modal-container.dark {
      background-color: #1f2937;
    }
    
    .dark .modal-header {
      border-bottom-color: #374151;
    }
    
    .dark .modal-header h2 {
      color: #f9fafb;
    }
    
    .dark .subtitle {
      color: #9ca3af;
    }
    
    .dark .close-btn {
      color: #9ca3af;
    }
    
    .dark .close-btn:hover {
      background-color: #374151;
      color: #f9fafb;
    }
    
    .dark .form-group label {
      color: #e5e7eb;
    }
    
    .dark .form-group input,
    .dark .form-group select {
      background-color: #111827;
      border-color: #4b5563;
      color: #f9fafb;
    }
    
    .dark .form-group input:focus,
    .dark .form-group select:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
    }
    
    .dark .toggle-password {
      color: #9ca3af;
    }
    
    .dark .checkbox-container {
      color: #d1d5db;
    }
    
    .dark .checkmark {
      background-color: #111827;
      border-color: #4b5563;
    }
    
    .dark .checkbox-container:hover input ~ .checkmark {
      border-color: #60a5fa;
    }
    
    .dark .checkbox-container input:checked ~ .checkmark {
      background-color: #60a5fa;
      border-color: #60a5fa;
    }
    
    .dark .link {
      color: #60a5fa;
    }
    
    .dark .sign-up-btn {
      background-color: #60a5fa;
    }
    
    .dark .sign-up-btn:hover:not(:disabled) {
      background-color: #93c5fd;
    }
    
    .dark .sign-up-btn:disabled {
      background-color: #6b7280;
    }
    
    .dark .sign-in-prompt {
      color: #d1d5db;
    }
    
    .dark .sign-in-link {
      color: #60a5fa;
    }
    
    .dark .form-hint {
      color: #9ca3af;
    }
    
    .dark .select-arrow {
      color: #9ca3af;
    }
    
    .dark .floating-emoji {
      filter: brightness(1.2);
    }
    
    @media (max-width: 640px) {
      .modal-header {
        padding: 1.25rem 1.5rem;
      }
      
      .modal-body {
        padding: 1.5rem;
      }
      
      .form-row {
        flex-direction: column;
        gap: 1.5rem;
      }
    }
  `]
})
export class SignUpFormComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignIn = new EventEmitter<void>();
  
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  country: string = '';
  agreeToTerms: boolean = false;
  receiveUpdates: boolean = false;
  showPassword: boolean = false;
  isDarkMode: boolean = false;
  
  floatingEmojis: { symbol: string, style: any }[] = [];
  private emojis = ['💰', '💵', '💸', '💲', '💹', '💳'];
  private maxEmojis = 10;
  private animationInterval: any;
  
  constructor(private router: Router) {
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }
  
  ngOnInit() {
    this.startEmojiAnimation();
  }
  
  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }
  
  private startEmojiAnimation() {
    this.animationInterval = setInterval(() => {
      if (this.floatingEmojis.length < this.maxEmojis) {
        this.addFloatingEmoji();
      }
      
      this.floatingEmojis = this.floatingEmojis.filter(emoji => 
        Date.now() - emoji.style.createdAt < 8000
      );
    }, 800);
  }

  private addFloatingEmoji() {
    const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
    const left = Math.random() * 100;
    const rotationStart = Math.random() * 360;
    const scale = 0.8 + Math.random() * 0.4;
    const duration = 6 + Math.random() * 4;
    
    this.floatingEmojis.push({
      symbol: randomEmoji,
      style: {
        left: `${left}%`,
        top: '-20px',
        transform: `rotate(${rotationStart}deg) scale(${scale})`,
        animationDuration: `${duration}s`,
        createdAt: Date.now()
      }
    });
  }
  
  closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeForm();
    }
  }
  
  closeForm() {
    this.close.emit();
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  isFormValid() {
    return this.firstName && 
           this.lastName && 
           this.email && 
           this.password && 
           this.country && 
           this.agreeToTerms;
  }
  
  createAccount() {
    if (!this.isFormValid()) return;
    
    console.log('Creating account with', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      country: this.country,
      agreeToTerms: this.agreeToTerms,
      receiveUpdates: this.receiveUpdates
    });
    
    // Navigate to user profile instead of dashboard
    this.closeForm();
    this.router.navigate(['/user-profile']);
  }
  
  onSwitchToSignIn(event: Event) {
    event.preventDefault();
    this.switchToSignIn.emit();
  }
}
