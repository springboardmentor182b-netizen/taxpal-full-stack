import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SignInFormComponent } from '../signin/sign-in-form.component';
import { SignUpFormComponent } from '../signup/sign-up-form.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, SignInFormComponent, SignUpFormComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  isDarkMode = false;
  floatingEmojis: { symbol: string; style: any }[] = [];
  showSignInForm = false;
  showSignUpForm = false;
  showProfileMenu = false;
  isMobileMenuOpen = false;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check if dark mode is enabled in localStorage
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Apply dark mode to document if needed
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }

    // Also add a global class to body for page-level styling
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    this.checkLoginStatus();
  }

  ngAfterViewInit() {
    // Move login status check here to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.checkLoginStatus();
    this.cdr.detectChanges();
  }

  checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('user_email') !== null;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  // New methods for mobile menu
  toggleMobileMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.cdr.detectChanges(); // Add this line
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.cdr.detectChanges(); // Add this line
  }

  // Add this method to navigate to routes from mobile menu
  navigateTo(route: string, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.closeMobileMenu();
    this.router.navigate([route]);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    // Update document classes
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
      document.body.classList.remove('dark-theme');
    }

    // Save preference to localStorage
    localStorage.setItem('darkMode', this.isDarkMode.toString());

    // Dispatch event to notify other components
    const event = new CustomEvent('darkModeChanged', {
      detail: { isDarkMode: this.isDarkMode }
    });
    window.dispatchEvent(event);
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu() {
    this.showProfileMenu = false;
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('user_email') !== null;
  }

  getUserName(): string {
    return localStorage.getItem('user_name') || 'User';
  }

  getUserEmail(): string {
    return localStorage.getItem('user_email') || '';
  }

  getUserInitial(): string {
    const name = this.getUserName();
    return name.charAt(0).toUpperCase();
  }

  logout() {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');

    // Close the profile menu
    this.closeProfileMenu();

    // Redirect to home page
    window.location.href = '/';
  }

  openSignInForm(event: Event) {
    event.preventDefault();
    this.showSignInForm = true;
    this.showSignUpForm = false;
    this.closeMobileMenu();
  }

  openSignUpForm(event: Event) {
    event.preventDefault();
    this.showSignUpForm = true;
    this.showSignInForm = false;
    this.closeMobileMenu();
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
