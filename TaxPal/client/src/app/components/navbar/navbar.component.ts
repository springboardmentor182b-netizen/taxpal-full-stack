import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { SignInFormComponent } from '../auth/sign-in-form.component';
import { SignUpFormComponent } from '../auth/sign-up-form.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, SignInFormComponent, SignUpFormComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
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

