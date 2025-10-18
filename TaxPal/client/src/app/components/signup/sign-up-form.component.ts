import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
    // Removed SignInFormComponent since it's not used in the template
  ],
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
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
  
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private router: Router, private http: HttpClient) {
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
           this.isValidEmail(this.email) && 
           this.password && 
           this.password.length >= 8 &&  // Ensure password has minimum length
           this.country && 
           this.agreeToTerms;
  }
  
  // Add email validation method
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  
  async createAccount() {
    if (!this.isFormValid() || this.loading) return;
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const payload = {
      email: this.email,
      name: `${this.firstName} ${this.lastName}`.trim(),
      country: this.country,
      password: this.password  // Include password in the payload
    };

    try {
      const res: any = await this.http.post('/api/users/register', payload).toPromise();
      this.successMsg = 'Account created! Redirecting...';
      setTimeout(() => {
        this.closeForm();
        this.router.navigate(['/user-profile']);
      }, 1200);
    } catch (err: any) {
      // Log the error for debugging
      console.error('Registration error:', err);
      // Show more details if available
      this.errorMsg = err?.error?.error || err?.message || 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
  
  onSwitchToSignIn(event: Event) {
    event.preventDefault();
    this.switchToSignIn.emit();
  }
}

// Make sure your frontend is POSTing to the correct backend URL.
// If you run Angular with a dev server (ng serve), and your backend is on a different port (e.g. 3000),
// you need to use the backend's port, not 4200, or set up a proxy.
// Example (if backend runs on http://localhost:3000):
// this.http.post('http://localhost:3000/api/users/register', payload)
// Or use Angular's proxy.conf.json to forward /api to your backend.