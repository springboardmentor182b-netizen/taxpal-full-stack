import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { SignInFormComponent } from '../signin/sign-in-form.component';
import { SignUpFormComponent } from '../signup/sign-up-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, SignInFormComponent, SignUpFormComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isDarkMode = document.documentElement.classList.contains('dark');
  isLoggedIn = false;
  userName = '';
  userEmail = '';
  userInitial = '';
  showProfileMenu = false;
  showSignInForm = false;
  showSignUpForm = false;
  
  // Event listener reference
  private userLoggedInListener: any;
  
  constructor() {
    this.checkLoginStatus();
    // Check for dark mode
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.isDarkMode = true;
    }
  }
  
  ngOnInit() {
    // Clear any existing auth data on home page load
    if (window.location.pathname === '/') {
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_id');
      this.isLoggedIn = false;
    }
    
    // Listen for dark mode changes
    window.addEventListener('darkModeChanged', (event: any) => {
      this.isDarkMode = event.detail?.isDarkMode || false;
    });
    
    // Listen for login events
    this.userLoggedInListener = window.addEventListener('userLoggedIn', (event: any) => {
      this.checkLoginStatus();
    });
  }
  
  ngOnDestroy() {
    // Remove event listener
    if (this.userLoggedInListener) {
      window.removeEventListener('userLoggedIn', this.userLoggedInListener);
    }
    // Remove dark mode listener
    window.removeEventListener('darkModeChanged', () => {});
  }
  
  checkLoginStatus() {
    const userEmail = localStorage.getItem('user_email');
    const userName = localStorage.getItem('user_name');
    
    this.isLoggedIn = !!userEmail;
    
    if (this.isLoggedIn) {
      this.userName = userName || 'User';
      this.userEmail = userEmail || '';
      this.userInitial = this.userName.charAt(0).toUpperCase();
    }
  }
  
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }
  
  closeProfileMenu() {
    this.showProfileMenu = false;
  }
  
  logout() {
    // Clear user data from localStorage
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    
    // Update login status
    this.isLoggedIn = false;
    this.showProfileMenu = false;
    
    // Force navigation to home
    window.location.href = '/';
  }

  // Auth form methods
  openSignInForm(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.showSignInForm = true;
    this.showSignUpForm = false;
  }
  
  openSignUpForm(event?: Event) {
    if (event) {
      event.preventDefault();
    }
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
}
