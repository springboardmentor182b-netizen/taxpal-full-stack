import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CategoriesComponent } from '../categories/categories.component';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, CategoriesComponent],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  isDarkMode = false;
  user = {
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  userInitial = '';
  showProfileMenu = false;
  
  // Form states
  loading = false;
  successMsg: string = '';
  errorMsg: string = '';
  
  // Password visibility toggles
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  constructor(private http: HttpClient, private router: Router) {}
  
  ngOnInit() {
    // Check dark mode
    this.isDarkMode = document.documentElement.classList.contains('dark') || 
                      document.body.classList.contains('dark-mode');
    
    // Get user info from localStorage
    const userName = localStorage.getItem('user_name') || '';
    const userEmail = localStorage.getItem('user_email') || '';
    
    if (!userEmail) {
      // Not logged in, redirect to home
      this.router.navigate(['/']);
      return;
    }
    
    // Set user info
    this.user.name = userName;
    this.user.email = userEmail;
    this.userInitial = userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase();
    
    // Listen for dark mode changes
    window.addEventListener('darkModeChanged', (event: any) => {
      this.isDarkMode = event.detail?.isDarkMode || false;
    });
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
    
    // Redirect to home page
    window.location.href = '/';
  }
  
  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  
  updateProfile() {
    // Reset messages
    this.successMsg = '';
    this.errorMsg = '';
    
    // Check if name and email are provided
    if (!this.user.name.trim()) {
      this.errorMsg = 'Name is required';
      return;
    }

    if (!this.user.email) {
      this.errorMsg = 'Email is required';
      return;
    }
    
    // Start loading state
    this.loading = true;
    
    // Prepare data for API
    const userData = {
      email: this.user.email,
      name: this.user.name
    };
    
    // Make API call to update name
    this.http.post('/api/users/update-profile', userData).subscribe({
      next: (response: any) => {
        this.successMsg = 'Profile updated successfully!';
        
        // Update localStorage
        localStorage.setItem('user_name', this.user.name);
        
        // Create event to notify other components
        const updateEvent = new CustomEvent('userProfileUpdated', { 
          detail: { name: this.user.name, email: this.user.email } 
        });
        window.dispatchEvent(updateEvent);
        
        this.loading = false;
      },
      error: (error) => {
        this.errorMsg = error.error?.message || 'Failed to update profile';
        this.loading = false;
      }
    });
  }
  
  updatePassword() {
    // Reset messages
    this.successMsg = '';
    this.errorMsg = '';
    
    // Validate passwords
    if (!this.user.currentPassword) {
      this.errorMsg = 'Current password is required';
      return;
    }
    
    if (!this.user.newPassword) {
      this.errorMsg = 'New password is required';
      return;
    }
    
    if (this.user.newPassword.length < 8) {
      this.errorMsg = 'New password must be at least 8 characters long';
      return;
    }
    
    if (this.user.newPassword !== this.user.confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }
    
    // Start loading state
    this.loading = true;
    
    // Prepare data for API
    const passwordData = {
      email: this.user.email,
      currentPassword: this.user.currentPassword,
      newPassword: this.user.newPassword
    };
    
    // Make API call to update password
    this.http.post('/api/users/update-password', passwordData).subscribe({
      next: (response: any) => {
        this.successMsg = 'Password updated successfully!';
        
        // Clear password fields
        this.user.currentPassword = '';
        this.user.newPassword = '';
        this.user.confirmPassword = '';
        
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMsg = error.error?.message || 'Failed to update password';
        this.loading = false;
      }
    });
  }
}