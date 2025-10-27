import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.css']
})
export class SignInFormComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignUp = new EventEmitter<void>();
  
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isDarkMode: boolean = false;
  loading = false;
  errorMsg = '';
  successMsg = '';
  
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
  
  async signIn() {
    if (!this.email || !this.password || this.loading) return;
    
    // Clear any existing auth data
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    try {
      const res: any = await this.http.post('/api/users/signin', {
        email: this.email,
        password: this.password
      }).toPromise();
      
      this.successMsg = 'Signed in!';
      
      // Store user info in localStorage or a service
      if (res?.user) {
        localStorage.setItem('user_email', res.user.email);
        localStorage.setItem('user_name', res.user.name || '');
        localStorage.setItem('user_id', res.user._id || '');
        
        // Create a custom event to notify other components about the user login
        const loginEvent = new CustomEvent('userLoggedIn', { 
          detail: { email: res.user.email, name: res.user.name } 
        });
        window.dispatchEvent(loginEvent);
      }
      
      // Immediate navigation without delay
      this.closeForm();
      this.router.navigate(['/user-profile']);
    } catch (err: any) {
      console.error('Sign in error:', err);
      // Show more specific error messages
      if (err.status === 401) {
        this.errorMsg = 'Incorrect password';
      } else if (err.status === 404) {
        this.errorMsg = 'No account found with that email';
      } else {
        this.errorMsg = err?.error?.error || 'Failed to sign in. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }
  
  onSwitchToSignUp(event: Event) {
    event.preventDefault();
    this.switchToSignUp.emit();
  }
}
