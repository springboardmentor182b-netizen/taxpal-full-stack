import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout {
  sidebarActive = false;
  collapsed = false;
   
  // Mock user data
  currentUser: { id: string, fullName: string, email: string } | null = null;
  userInitials = '';

  constructor(private router: Router,private authService: AuthService  ) {}
  ngOnInit(): void {
    const userData = sessionStorage.getItem('current_user') || localStorage.getItem('current_user');
    if (!userData) {
      this.router.navigate(['/features/login']);
      return;
    }

    this.currentUser = JSON.parse(userData) as { id: string, fullName: string, email: string };
    this.setUserInitials(this.currentUser.fullName);

  }

  private setUserInitials(fullName: string) {
    const names = fullName.trim().split(' ');
    this.userInitials = names.length === 1
      ? names[0].charAt(0).toUpperCase()
      : names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }
  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  closeSidebarOverlay() {
    this.sidebarActive = false;
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  goToDashboard() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  goToBudgets() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/budgets']);
    });
  }
 
goToTaxEtimator() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/tax-estimator']);
    });
  }

  goToReports() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/reports']);
    });
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        this.router.navigate(['/login']);
      }
    });
  }
}
