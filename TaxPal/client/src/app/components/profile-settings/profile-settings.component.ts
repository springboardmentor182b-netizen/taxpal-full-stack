import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

interface Category {
  name: string;
  _id?: string;
  color?: string;
}

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
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
  successMsg = '';
  errorMsg = '';
  
  // Password visibility toggles
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  // Categories
  incomeCategories: Category[] = [];
  expenseCategories: Category[] = [];
  categoryColors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316'  // orange
  ];
  
  // Category suggestions
  incomeCategorySuggestions = [
    'Salary',
    'Freelance',
    'Consulting',
    'Investments',
    'Rental Income',
    'Dividends',
    'Client Payments',
    'Commissions',
    'Royalties',
    'Side Gig'
  ];

  expenseCategorySuggestions = [
    'Rent/Mortgage',
    'Utilities',
    'Business Expenses',
    'Groceries',
    'Transportation',
    'Software/Subscriptions',
    'Office Supplies',
    'Insurance',
    'Marketing',
    'Travel',
    'Professional Fees',
    'Equipment'
  ];
  
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
    
    // Load categories
    this.loadCategories();
  }
  
  loadCategories() {
    // Get user ID from localStorage
    const userId = localStorage.getItem('user_id');
    
    if (userId) {
      // Use the API URL without hardcoding localhost
      const apiUrl = `/api/categories/user/${userId}`;
      console.log('Fetching categories from:', apiUrl);
      
      this.http.get(apiUrl).subscribe({
        next: (response: any) => {
          console.log('Categories API response:', response);
          if (response.success && response.data) {
            this.incomeCategories = response.data.incomeCategories || [];
            this.expenseCategories = response.data.expenseCategories || [];
          } else {
            // If no categories in the API, load from localStorage
            this.loadCategoriesFromLocalStorage();
          }
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
          // Fallback to localStorage if API call fails
          this.loadCategoriesFromLocalStorage();
        }
      });
    } else {
      // Not logged in, use localStorage
      this.loadCategoriesFromLocalStorage();
    }
  }
  
  loadCategoriesFromLocalStorage() {
    // Fetch categories from localStorage
    const savedIncomeCategories = localStorage.getItem('income_categories');
    const savedExpenseCategories = localStorage.getItem('expense_categories');
    
    // Initialize with empty arrays instead of defaults
    this.incomeCategories = savedIncomeCategories ? JSON.parse(savedIncomeCategories) : [];
    this.expenseCategories = savedExpenseCategories ? JSON.parse(savedExpenseCategories) : [];
  }
  
  getCategoryColor(index: number, type: 'income' | 'expense'): string {
    // Get a consistent color based on the index
    return this.categoryColors[index % this.categoryColors.length];
  }
  
  addCategory(type: 'income' | 'expense') {
    if (type === 'income') {
      this.incomeCategories.push({ name: 'New Category' });
    } else {
      this.expenseCategories.push({ name: 'New Category' });
    }
  }
  
  removeCategory(index: number, type: 'income' | 'expense') {
    if (type === 'income') {
      this.incomeCategories.splice(index, 1);
    } else {
      this.expenseCategories.splice(index, 1);
    }
  }
  
  saveCategories() {
    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';
    
    // Filter out empty category names
    this.incomeCategories = this.incomeCategories.filter(cat => cat.name.trim() !== '');
    this.expenseCategories = this.expenseCategories.filter(cat => cat.name.trim() !== '');
    
    // Save to localStorage as backup
    localStorage.setItem('income_categories', JSON.stringify(this.incomeCategories));
    localStorage.setItem('expense_categories', JSON.stringify(this.expenseCategories));
    
    // Get user ID
    const userId = localStorage.getItem('user_id');
    
    if (userId) {
      // Prepare all categories for API
      const categories = [
        ...this.incomeCategories.map(cat => ({
          name: cat.name,
          type: 'income',
          color: cat.color || this.getCategoryColor(this.incomeCategories.indexOf(cat), 'income')
        })),
        ...this.expenseCategories.map(cat => ({
          name: cat.name,
          type: 'expense',
          color: cat.color || this.getCategoryColor(this.expenseCategories.indexOf(cat), 'expense')
        }))
      ];
      
      // Use relative URL instead of hardcoding localhost
      const apiUrl = '/api/categories/batch';
      console.log('Saving categories to:', apiUrl);
      
      // Save to API
      this.http.post(apiUrl, { userId, categories }).subscribe({
        next: (response: any) => {
          console.log('Save categories response:', response);
          this.successMsg = 'Categories saved successfully!';
          this.loading = false;
        },
        error: (error) => {
          console.error('Error saving categories:', error);
          this.errorMsg = error.error?.message || 'Failed to save categories';
          this.loading = false;
        }
      });
    } else {
      // No user ID, just show success from localStorage
      setTimeout(() => {
        this.successMsg = 'Categories saved locally!';
        this.loading = false;
      }, 800);
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
    this.http.post('http://localhost:5000/api/users/update-profile', userData).subscribe({
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
    this.http.post('http://localhost:5000/api/users/update-password', passwordData).subscribe({
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
  
  /**
   * Add a suggested category to the appropriate list
   */
  addSuggestedCategory(type: 'income' | 'expense', name: string) {
    // Check if category already exists
    if (type === 'income') {
      if (!this.incomeCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
        this.incomeCategories.push({ name });
        
        // Animate the newly added item
        setTimeout(() => {
          const elements = document.querySelectorAll('.category-item');
          if (elements.length > 0) {
            const lastElement = elements[elements.length - 1] as HTMLElement;
            lastElement.classList.add('highlight-animation');
            setTimeout(() => lastElement.classList.remove('highlight-animation'), 1000);
          }
        }, 50);
      } else {
        // Highlight the existing category
        const index = this.incomeCategories.findIndex(
          cat => cat.name.toLowerCase() === name.toLowerCase()
        );
        if (index >= 0) {
          setTimeout(() => {
            const elements = document.querySelectorAll('.category-item');
            if (elements.length > index) {
              const element = elements[index] as HTMLElement;
              element.classList.add('highlight-animation');
              setTimeout(() => element.classList.remove('highlight-animation'), 1000);
            }
          }, 50);
        }
      }
    } else {
      if (!this.expenseCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
        this.expenseCategories.push({ name });
        
        // Animate the newly added item
        setTimeout(() => {
          const elements = document.querySelectorAll('.categories-section:nth-child(2) .category-item');
          if (elements.length > 0) {
            const lastElement = elements[elements.length - 1] as HTMLElement;
            lastElement.classList.add('highlight-animation');
            setTimeout(() => lastElement.classList.remove('highlight-animation'), 1000);
          }
        }, 50);
      } else {
        // Highlight the existing category
        const index = this.expenseCategories.findIndex(
          cat => cat.name.toLowerCase() === name.toLowerCase()
        );
        if (index >= 0) {
          setTimeout(() => {
            const elements = document.querySelectorAll('.categories-section:nth-child(2) .category-item');
            if (elements.length > index) {
              const element = elements[index] as HTMLElement;
              element.classList.add('highlight-animation');
              setTimeout(() => element.classList.remove('highlight-animation'), 1000);
            }
          }, 50);
        }
      }
    }
  }
}