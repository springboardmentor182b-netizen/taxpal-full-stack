import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-sign-in-form',
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
            <h2>Welcome back to TaxPal</h2>
            <p class="subtitle">Sign in to access your tax dashboard</p>
          </div>
          <button class="close-btn" (click)="closeForm()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email"
              [(ngModel)]="email"
              required
            >
          </div>
          
          <div class="form-group">
            <div class="password-label">
              <label for="password">Password</label>
              <a href="#" class="forgot-password">Forgot password?</a>
            </div>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                name="password" 
                placeholder="Enter your password"
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
          
          <div class="form-group remember-me">
            <label class="checkbox-container">
              <input type="checkbox" [(ngModel)]="rememberMe">
              <span class="checkmark"></span>
              Remember me
            </label>
          </div>
          
          <button type="button" class="sign-in-btn" (click)="signIn()">
            Sign in
          </button>
          
          <p class="sign-up-prompt">
            Don't have an account? <a href="#" class="sign-up-link" (click)="onSwitchToSignUp($event)">Create one Now</a>
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
      max-width: 500px;
      margin: 0 1rem;
      animation: slideUp 0.3s ease;
      overflow: hidden;
      position: relative;
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
    
    .form-group input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
    
    .password-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .forgot-password {
      font-size: 0.875rem;
      color: #3b82f6;
      text-decoration: none;
    }
    
    .forgot-password:hover {
      text-decoration: underline;
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
    
    .remember-me {
      display: flex;
      align-items: center;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 0.875rem;
      color: #4b5563;
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
      background-color: #fff;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      margin-right: 0.5rem;
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
    
    .sign-in-btn {
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
    
    .sign-in-btn:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
    }
    
    .sign-in-btn:active {
      transform: translateY(0);
    }
    
    .sign-up-prompt {
      text-align: center;
      font-size: 0.875rem;
      color: #4b5563;
      margin-top: 0;
      margin-bottom: 0;
    }
    
    .sign-up-link {
      color: #3b82f6;
      font-weight: 500;
      text-decoration: none;
    }
    
    .sign-up-link:hover {
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
    
    .dark .form-group input {
      background-color: #111827;
      border-color: #4b5563;
      color: #f9fafb;
    }
    
    .dark .form-group input:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
    }
    
    .dark .forgot-password {
      color: #60a5fa;
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
    
    .dark .sign-in-btn {
      background-color: #60a5fa;
    }
    
    .dark .sign-in-btn:hover {
      background-color: #93c5fd;
    }
    
    .dark .divider {
      color: #9ca3af;
    }
    
    .dark .divider::before,
    .dark .divider::after {
      border-top-color: #4b5563;
    }
    
    @media (max-width: 480px) {
      .modal-header {
        padding: 1.25rem 1.5rem;
      }
      
      .modal-body {
        padding: 1.5rem;
      }
    }
  `]
})
export class SignInFormComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignUp = new EventEmitter<void>();
  
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isDarkMode: boolean = false;
  
  floatingEmojis: { symbol: string, style: any }[] = [];
  private emojis = ['💰', '💵', '💸', '💲', '💹', '💳'];
  private maxEmojis = 10;
  private animationInterval: any;
  
  constructor(private router: Router, private http: HttpClient) {
    // Check if dark mode is enabled
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
        top: '-20px', // Changed from bottom to top
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
  
  signIn() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:5000/api/user/login', { email: this.email, password: this.password }, { headers })
      .subscribe({
        next: (res: any) => {
          console.log('Login successful:', res);
          localStorage.setItem('jwt', res.token);
          this.closeForm();
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Invalid credentials');
        }
      });
  }
  
  onSwitchToSignUp(event: Event) {
    event.preventDefault();
    this.switchToSignUp.emit();
  }
}
