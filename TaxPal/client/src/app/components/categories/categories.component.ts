import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Category {
  name: string;
  _id?: string;
}

interface CategoryResponse extends Category {
  userId: string;
  type: 'income' | 'expense';
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
    
    // Get user ID from localStorage
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.errorMsg = 'User ID not found';
      return;
    }
    
    // Set loading state
    this.loading = true;
    
    // First, try to load from MongoDB via API
    this.http.get(`/api/categories/${userId}`).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response)) {
          // Process categories from the backend
          this.incomeCategories = response.filter(cat => cat.type === 'income');
          this.expenseCategories = response.filter(cat => cat.type === 'expense');
          this.loading = false;
        }
      },
      error: (error) => {
        console.log('Failed to load categories from API, falling back to localStorage');
        // Fallback to localStorage if API fails
        this.loadCategoriesFromLocalStorage();
        this.loading = false;
      }
    });
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
    // Reset messages
    this.successMsg = '';
    this.errorMsg = '';
    
    // Start loading state
    this.loading = true;
    
    // Filter out empty category names
    this.incomeCategories = this.incomeCategories.filter(cat => cat.name.trim() !== '');
    this.expenseCategories = this.expenseCategories.filter(cat => cat.name.trim() !== '');
    
    // Get user ID from localStorage
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      this.errorMsg = 'User ID not found';
      this.loading = false;
      return;
    }
    
    // Save to localStorage as backup
    localStorage.setItem('income_categories', JSON.stringify(this.incomeCategories));
    localStorage.setItem('expense_categories', JSON.stringify(this.expenseCategories));
    
    // Prepare all categories for the API
    const allCategories = [
      ...this.incomeCategories.map(cat => ({
        userId,
        name: cat.name,
        type: 'income',
        _id: cat._id
      })),
      ...this.expenseCategories.map(cat => ({
        userId,
        name: cat.name,
        type: 'expense',
        _id: cat._id
      }))
    ];
    
    // Save to MongoDB via API
    this.http.post('/api/categories', { categories: allCategories }).subscribe({
      next: (response: any) => {
        this.successMsg = 'Categories saved successfully!';
        
        // Update local categories with the ones from the server (with IDs)
        if (response.categories) {
          this.incomeCategories = response.categories.filter((cat: CategoryResponse) => cat.type === 'income');
          this.expenseCategories = response.categories.filter((cat: CategoryResponse) => cat.type === 'expense');
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