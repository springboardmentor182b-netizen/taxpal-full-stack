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
    <app-navbar *ngIf="!isProfilePage"></app-navbar>
    <app-profile-navbar *ngIf="isProfilePage"></app-profile-navbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      color: #1a202c;
    }
  `]
})
export class App implements OnInit {
  title = 'TaxPal';
  isProfilePage = false;
  
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
                         url.includes('/tax-estimator');
  }
}
