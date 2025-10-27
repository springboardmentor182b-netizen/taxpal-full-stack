import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Category {
  name: string;
  _id?: string;
}

interface CategoryResponse extends Category {
  userId: string;
  userName?: string;  // Add userName field
  type: 'income' | 'expense';
  color?: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  // Categories
  incomeCategories: Category[] = [];
  expenseCategories: Category[] = [];
  
  // API base URL
  private apiUrl = environment.apiUrl || '/api';
  
  // Loading and message states
  loading = false;
  successMsg = '';
  errorMsg = '';

  // Category color palette
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

  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadCategories();
  }
  
  loadCategories() {
    // Reset messages
    this.successMsg = '';
    this.errorMsg = '';
    
    // Get user ID and email from localStorage
    const userId = localStorage.getItem('user_id');
    const userEmail = localStorage.getItem('user_email');
    
    if (!userId && !userEmail) {
      this.errorMsg = 'User information not found. Please sign in again.';
      // Load from localStorage as fallback
      this.loadCategoriesFromLocalStorage();
      return;
    }
    
    // Set loading state
    this.loading = true;
    
    // Try first with userId, then with email if userId fails
    if (userId) {
      this.loadCategoriesByUserId(userId);
    } else if (userEmail) {
      this.loadCategoriesByEmail(userEmail);
    }
  }

  loadCategoriesByUserId(userId: string) {
    this.http.get(`${this.apiUrl}/users/categories/${userId}`).subscribe({
      next: (response: any) => {
        this.processCategoriesResponse(response);
      },
      error: (error) => {
        console.log('Failed to load categories by user ID, trying email instead...');
        // Try to load by email if userId fails
        const userEmail = localStorage.getItem('user_email');
        if (userEmail) {
          this.loadCategoriesByEmail(userEmail);
        } else {
          console.log('No email found, falling back to localStorage');
          this.loadCategoriesFromLocalStorage();
          this.loading = false;
        }
      }
    });
  }

  loadCategoriesByEmail(email: string) {
    // Use a workaround to handle the route conflict between /categories/:userId and /categories/email/:email
    // By using a custom prefix for email endpoint
    this.http.get(`${this.apiUrl}/users/categories-by-email/${encodeURIComponent(email)}`).subscribe({
      next: (response: any) => {
        this.processCategoriesResponse(response);
      },
      error: (error) => {
        console.log('Failed to load categories from API, falling back to localStorage', error);
        this.loadCategoriesFromLocalStorage();
        this.loading = false;
      }
    });
  }

  processCategoriesResponse(response: any) {
    if (response && Array.isArray(response)) {
      // Process categories from the backend
      this.incomeCategories = response
        .filter((cat: CategoryResponse) => cat.type === 'income')
        .map((cat: CategoryResponse) => ({
          name: cat.name,
          _id: cat._id
        }));
        
      this.expenseCategories = response
        .filter((cat: CategoryResponse) => cat.type === 'expense')
        .map((cat: CategoryResponse) => ({
          name: cat.name,
          _id: cat._id
        }));
        
      // Save to localStorage as backup
      localStorage.setItem('income_categories', JSON.stringify(this.incomeCategories));
      localStorage.setItem('expense_categories', JSON.stringify(this.expenseCategories));
    } else {
      // If response is not an array, fall back to localStorage
      this.loadCategoriesFromLocalStorage();
    }
    this.loading = false;
  }
  
  loadCategoriesFromLocalStorage() {
    const savedIncomeCategories = localStorage.getItem('income_categories');
    const savedExpenseCategories = localStorage.getItem('expense_categories');
    
    // Initialize with empty arrays if nothing found in localStorage
    this.incomeCategories = savedIncomeCategories ? JSON.parse(savedIncomeCategories) : [];
    this.expenseCategories = savedExpenseCategories ? JSON.parse(savedExpenseCategories) : [];
  }
  
  getCategoryColor(index: number, type: 'income' | 'expense'): string {
    // Get a consistent color based on the index
    return this.categoryColors[index % this.categoryColors.length];
  }
  
  addCategory(type: 'income' | 'expense') {
    if (type === 'income') {
      this.incomeCategories.push({ name: '' });
    } else {
      this.expenseCategories.push({ name: '' });
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
    // Reset messages
    this.successMsg = '';
    this.errorMsg = '';
    
    // Start loading state
    this.loading = true;
    
    // Filter out empty category names
    this.incomeCategories = this.incomeCategories.filter(cat => cat.name.trim() !== '');
    this.expenseCategories = this.expenseCategories.filter(cat => cat.name.trim() !== '');
    
    // Get user ID and name from localStorage
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name') || 'User';
    
    if (!userId) {
      this.errorMsg = 'User ID not found. Please sign in again.';
      this.loading = false;
      return;
    }
    
    // Save to localStorage as backup
    localStorage.setItem('income_categories', JSON.stringify(this.incomeCategories));
    localStorage.setItem('expense_categories', JSON.stringify(this.expenseCategories));
    
    // Prepare all categories for the API with current user's ID and name
    const allCategories = [
      ...this.incomeCategories.map((cat, index) => ({
        userId,
        userName,  // Include the user's name
        name: cat.name,
        type: 'income',
        color: this.getCategoryColor(index, 'income'),
        _id: cat._id
      })),
      ...this.expenseCategories.map((cat, index) => ({
        userId,
        userName,  // Include the user's name
        name: cat.name,
        type: 'expense',
        color: this.getCategoryColor(index, 'expense'),
        _id: cat._id
      }))
    ];
    
    // Save to MongoDB via API - use the correct endpoint path
    this.http.post(`${this.apiUrl}/users/categories/batch`, { categories: allCategories }).subscribe({
      next: (response: any) => {
        this.successMsg = 'Categories saved successfully!';
        
        // Update local categories with the ones from the server (with IDs)
        if (response.categories) {
          this.incomeCategories = response.categories
            .filter((cat: CategoryResponse) => cat.type === 'income')
            .map((cat: CategoryResponse) => ({
              name: cat.name,
              _id: cat._id
            }));
            
          this.expenseCategories = response.categories
            .filter((cat: CategoryResponse) => cat.type === 'expense')
            .map((cat: CategoryResponse) => ({
              name: cat.name,
              _id: cat._id
            }));
            
          // Update localStorage with updated data
          localStorage.setItem('income_categories', JSON.stringify(this.incomeCategories));
          localStorage.setItem('expense_categories', JSON.stringify(this.expenseCategories));
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.errorMsg = error.error?.message || 'Failed to save categories';
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
          const elements = document.querySelectorAll('.income-categories .category-item');
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
            const elements = document.querySelectorAll('.income-categories .category-item');
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
          const elements = document.querySelectorAll('.expense-categories .category-item');
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
            const elements = document.querySelectorAll('.expense-categories .category-item');
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