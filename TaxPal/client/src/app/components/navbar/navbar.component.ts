import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SignInFormComponent } from '../signin/sign-in-form.component';
import { SignUpFormComponent } from '../signup/sign-up-form.component';
import { DarkModeService } from '../../core/services/dark-mode.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, SignInFormComponent, SignUpFormComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isDarkMode = false;

  showSignInForm = false;
  showSignUpForm = false;

  userName = '';
  userEmail = '';
  userInitial = '';
  showProfileMenu = false;

  floatingEmojis: { symbol: string, style: any }[] = [];
  private emojis = ['💰', '💵', '💸', '💲', '💹', '💳'];
  private maxEmojis = 10;
  private animationInterval: any;
  
  private darkModeSubscription: Subscription = new Subscription();

  constructor(private darkModeService: DarkModeService) {
    // Check for saved preference on component initialization
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.darkModeService.setDarkMode(true);
    }
  }

  ngOnInit() {
    this.darkModeSubscription = this.darkModeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    this.loadUserData();
    this.startEmojiAnimation();
    // Load profile menu state
    const savedMenuState = localStorage.getItem('showProfileMenu');
    if (savedMenuState === 'true') {
      this.showProfileMenu = true;
    }
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    this.darkModeSubscription.unsubscribe();
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

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
  
  isUserLoggedIn(): boolean {
    return localStorage.getItem('user_email') !== null;
  }
  
  openSignInForm(event: Event) {
    event.preventDefault();
    this.showSignInForm = true;
    this.showSignUpForm = false;
  }
  
  openSignUpForm(event: Event) {
    event.preventDefault();
    this.showSignUpForm = true;
    this.showSignInForm = false;
  }
  
  closeAuthForms() {
    this.showSignInForm = false;
    this.showSignUpForm = false;
  }
  
  switchToSignUp() {
    this.showSignInForm = false;
    this.showSignUpForm = true;
  }
  
  switchToSignIn() {
    this.showSignUpForm = false;
    this.showSignInForm = true;
  }

  loadUserData() {
    if (this.isUserLoggedIn()) {
      this.userEmail = localStorage.getItem('user_email') || '';
      this.userName = localStorage.getItem('user_name') || 'User';
      this.userInitial = this.userName.charAt(0).toUpperCase();
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    localStorage.setItem('showProfileMenu', this.showProfileMenu.toString());
  }

  logout() {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('showProfileMenu');
    this.userName = '';
    this.userEmail = '';
    this.userInitial = '';
    this.showProfileMenu = false;
    // Navigate to home or reload
    window.location.href = '/';
  }
}
