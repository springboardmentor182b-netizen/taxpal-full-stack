import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="profile-settings-container" [ngClass]="{ 'dark': isDarkMode }">
      <div class="profile-settings-card">
        <div class="profile-header">
          <h1>Profile Settings</h1>
          <p class="subtitle">Manage your account information and preferences</p>
        </div>
        
        <div class="profile-avatar-section">
          <div class="avatar">
            <span>S</span>
          </div>
          <button class="change-avatar-btn">Change Avatar</button>
        </div>
        
        <div class="settings-form">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" name="fullName" [(ngModel)]="userProfile.fullName" class="form-control">
          </div>
          
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" [(ngModel)]="userProfile.email" class="form-control">
          </div>
          
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" [(ngModel)]="userProfile.phoneNumber" class="form-control">
          </div>
          
          <div class="form-row">
            <div class="form-group half-width">
              <label for="country">Country</label>
              <select id="country" name="country" [(ngModel)]="userProfile.country" class="form-control">
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="au">Australia</option>
              </select>
            </div>
            
            <div class="form-group half-width">
              <label for="language">Language</label>
              <select id="language" name="language" [(ngModel)]="userProfile.language" class="form-control">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Email Notifications</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="newsletter" name="newsletter" [(ngModel)]="userProfile.notifications.newsletter">
                <label for="newsletter">Weekly newsletter</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="taxUpdates" name="taxUpdates" [(ngModel)]="userProfile.notifications.taxUpdates">
                <label for="taxUpdates">Tax law updates</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="accountActivity" name="accountActivity" [(ngModel)]="userProfile.notifications.accountActivity">
                <label for="accountActivity">Account activity</label>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button class="btn-cancel" routerLink="/user-profile">Cancel</button>
            <button class="btn-save" (click)="saveProfile()">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-settings-container {
      min-height: calc(100vh - 80px);
      padding: 2rem 1rem;
      background-color: #f9fafb;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    
    .profile-settings-container.dark {
      background-color: #111827;
      color: #f9fafb;
    }
    
    .profile-settings-card {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      width: 100%;
      max-width: 700px;
      padding: 2rem;
    }
    
    .dark .profile-settings-card {
      background-color: #1f2937;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }
    
    .profile-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .profile-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }
    
    .dark .profile-header h1 {
      color: #f9fafb;
    }
    
    .subtitle {
      color: #6b7280;
      font-size: 1rem;
      margin: 0;
    }
    
    .dark .subtitle {
      color: #9ca3af;
    }
    
    .profile-avatar-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #3b82f6;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
    }
    
    .change-avatar-btn {
      background-color: transparent;
      border: 1px solid #d1d5db;
      color: #4b5563;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .change-avatar-btn:hover {
      background-color: #f3f4f6;
      border-color: #9ca3af;
    }
    
    .dark .change-avatar-btn {
      border-color: #4b5563;
      color: #d1d5db;
    }
    
    .dark .change-avatar-btn:hover {
      background-color: #374151;
      border-color: #6b7280;
    }
    
    .settings-form {
      width: 100%;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .half-width {
      flex: 1;
      margin-bottom: 0;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }
    
    .dark label {
      color: #e5e7eb;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
      background-color: white;
      color: #1f2937;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }
    
    .dark .form-control {
      background-color: #374151;
      border-color: #4b5563;
      color: #f9fafb;
    }
    
    .dark .form-control:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
    }
    
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .checkbox-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    
    .checkbox-item label {
      margin-bottom: 0;
      cursor: pointer;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .btn-cancel {
      padding: 0.75rem 1.5rem;
      background-color: white;
      border: 1px solid #d1d5db;
      color: #4b5563;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-cancel:hover {
      background-color: #f3f4f6;
      border-color: #9ca3af;
    }
    
    .dark .btn-cancel {
      background-color: #1f2937;
      border-color: #4b5563;
      color: #e5e7eb;
    }
    
    .dark .btn-cancel:hover {
      background-color: #374151;
      border-color: #6b7280;
    }
    
    .btn-save {
      padding: 0.75rem 1.5rem;
      background-color: #3b82f6;
      border: none;
      color: white;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-save:hover {
      background-color: #2563eb;
    }
    
    .dark .btn-save {
      background-color: #60a5fa;
      color: #111827;
    }
    
    .dark .btn-save:hover {
      background-color: #3b82f6;
    }
    
    @media (max-width: 640px) {
      .profile-settings-card {
        padding: 1.5rem;
      }
      
      .form-row {
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .form-actions {
        flex-direction: column-reverse;
        gap: 0.75rem;
      }
      
      .btn-cancel, .btn-save {
        width: 100%;
      }
    }
  `]
})
export class ProfileSettingsComponent {
  isDarkMode = false;
  
  userProfile = {
    fullName: 'Sam Johnson',
    email: 'sam.johnson@example.com',
    phoneNumber: '+1 (555) 123-4567',
    country: 'us',
    language: 'en',
    notifications: {
      newsletter: true,
      taxUpdates: true,
      accountActivity: false
    }
  };
  
  constructor() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.isDarkMode = true;
    }
  }
  
  saveProfile() {
    // In a real app, you would save the profile data to a backend service
    console.log('Saving profile:', this.userProfile);
    
    // Show a success message (in a real app, you'd use a proper notification system)
    alert('Profile saved successfully!');
  }
}
