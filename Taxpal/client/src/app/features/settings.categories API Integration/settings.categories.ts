import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CategoryService, Category } from '../../core/services/category.service';

@Component({
  selector: 'app-settings-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './settings.categories.html',
  styleUrls: ['./settings.categories.css']
})
export class SettingsCategoriesComponent implements OnInit {
  categories: Category[] = [];

  // Form fields
  categoryName: string = '';
  categoryType: 'expense' | 'income' = 'expense';

  // Editing state
  isEditing: boolean = false;
  currentEditId: string | null = null;

  // Loading state
  isLoading: boolean = false;
  error: string = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  // Load categories from backend
  loadCategories(): void {
    console.log("called");
    this.isLoading = true;
    this.error = '';

    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error: string) => {
        this.error = 'Failed to load categories: ' + error;
        this.isLoading = false;
        console.error('Error loading categories:', error);

        // Fallback to local data if API fails
        this.initializeExistingCategories();
      }
    });
  }

  // Fallback method if API is not available
  private initializeExistingCategories(): void {
    const existingCategories: Omit<Category, '_id'>[] = [
      { name: 'Business Expenses', type: 'expense' },
      { name: 'Office Rent', type: 'expense' },
      { name: 'Software Subscriptions', type: 'expense' },
      { name: 'Side income', type: 'income' },
      { name: 'Salary', type: 'income' }
    ];

    // Add temporary IDs for frontend use
    this.categories = existingCategories.map((category, index) => ({
      ...category,
      id: index + 1
    }));
  }

  handleAddCategory(): void {
    const categoryName = this.categoryName.trim();

    if (categoryName === '') {
      alert('Please enter a category name');
      return;
    }

    if (this.isEditing && this.currentEditId !== null) {
      this.updateCategory(this.currentEditId, categoryName, this.categoryType);
    } else {
      this.addNewCategory(categoryName, this.categoryType);
    }
  }

  private addNewCategory(name: string, type: 'expense' | 'income'): void {
    this.isLoading = true;

    this.categoryService.createCategory({ name, type }).subscribe({
      next: (newCategory: any) => {
        this.loadCategories();
        this.resetForm();
        this.isLoading = false;
      },
      error: (error: string) => {
        this.error = 'Failed to create category: ' + error;
        this.isLoading = false;
        console.error('Error creating category:', error);
        alert('Failed to create category. Please try again.');
      }
    });
  }

  private updateCategory(id: string, name: string, type: 'expense' | 'income'): void {
  this.isLoading = true;

  this.categoryService.updateCategory(id, { name, type }).subscribe({
  next: (updatedCategory: any) => {
    this.loadCategories();
    this.cancelEdit();
    this.isLoading = false;
  },
    error: (error: string) => {
      this.error = 'Failed to update category: ' + error;
      this.isLoading = false;
      console.error('Error updating category:', error);
      alert('Failed to update category. Please try again.');
    }
  });
}


  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.isLoading = true;

      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.isLoading = false;
        },
        error: (error: string) => {
          this.error = 'Failed to delete category: ' + error;
          this.isLoading = false;
          console.error('Error deleting category:', error);
          alert('Failed to delete category. Please try again.');
        }
      });
    }
  }

  startEdit(id: string): void {
    if (this.isEditing) {
      this.cancelEdit();
    }

    const category = this.categories.find(cat => cat._id === id);
    if (!category) return;

    this.isEditing = true;
    this.currentEditId = id;

    // Update form fields
    this.categoryName = category.name;
    this.categoryType = category.type;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentEditId = null;
    this.resetForm();
  }

  private resetForm(): void {
    this.categoryName = '';
    this.categoryType = 'expense';
    this.isEditing = false;
    this.currentEditId = null;
    this.error = '';
  }

  getExpenseCategories(): Category[] {
    return this.categories.filter(cat => cat.type === 'expense');
  }

  getIncomeCategories(): Category[] {
    return this.categories.filter(cat => cat.type === 'income');
  }
}
