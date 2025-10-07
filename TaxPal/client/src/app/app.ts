import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileNavbarComponent } from './components/navbar/profile-navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ProfileNavbarComponent],
  template: `
    <!-- Display regular navbar on home page -->
    <app-navbar *ngIf="shouldShowMainNavbar()"></app-navbar>
    
    <!-- Display profile navbar on user-related pages -->
    <app-profile-navbar *ngIf="shouldShowProfileNavbar()"></app-profile-navbar>
    
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      color: #1a202c;
    }
  `]
})
export class App implements OnInit {
  private isProfilePage: boolean = false;
  title = 'TaxPal';
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Check initial route
    this.checkIfProfilePage(this.router.url);
    
    // Subscribe to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkIfProfilePage(event.url);
      }
    });
  }
  
  private checkIfProfilePage(url: string): void {
    this.isProfilePage = url.includes('/user-profile') || 
                         url.includes('/transactions') ||
                         url.includes('/budget') ||
                         url.includes('/reports') ||
                         url.includes('/tax-estimator') ||
                         url.includes('/tax-calendar'); // Add tax-calendar to the profile paths
  }
  
  shouldShowMainNavbar(): boolean {
    // Show main navbar only on routes that aren't user profile related
    const path = window.location.pathname;
    return !this.isUserProfilePath(path);
  }
  
  shouldShowProfileNavbar(): boolean {
    // Show profile navbar on user profile related routes
    const path = window.location.pathname;
    return this.isUserProfilePath(path);
  }
  
  private isUserProfilePath(path: string): boolean {
    const userPaths = [
      '/user-profile', 
      '/profile-settings', 
      '/transactions', 
      '/budget', 
      '/reports', 
      '/tax-estimator',
      '/tax-calendar'  // Add tax-calendar to the userPaths array
    ];
    return userPaths.some(userPath => path.startsWith(userPath));
  }
}
