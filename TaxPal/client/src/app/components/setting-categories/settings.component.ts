// client/src/app/pages/settings/categories/category-management.component.ts

import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { Category, CategoryService } from '../../../services/category.service'; // 🚨 Updated path
import { HttpClientModule } from '@angular/common/http'; // Must import for standalone component

@Component({
  selector: 'app-category-management', // 🚨 RENAMED selector
  standalone: true,
  // 🚨 ADD HttpClientModule (and potentially your custom component/modal imports)
  imports: [NgFor, NgIf, NgClass, HttpClientModule], 
  // 🚨 Update style URL path if necessary (or rename your CSS file)
  styleUrls: ['./category-management.component.css'], 
  // 🚨 HTML template is simplified to just the article content (see notes below)
  template: `
    <article class="card">
      <h4>Category Management</h4>
      <div class="sub">Manage your income and expense categories</div>

      <div class="tabs" role="tablist" aria-label="Category Type">
        <button
          type="button"
          class="tab"
          [class.active]="selectedTab==='expense'"
          role="tab"
          [attr.aria-selected]="selectedTab==='expense'"
          (click)="switchTab('expense')"
        >
          Expense Categories
        </button>
        <button
          type="button"
          class="tab"
          [class.active]="selectedTab==='income'"
          role="tab"
          [attr.aria-selected]="selectedTab==='income'"
          (click)="switchTab('income')"
        >
          Income Categories
        </button>
      </div>
      
      <div *ngIf="isLoading" class="loading-state">Loading categories...</div>

      <div class="list" *ngIf="selectedTab==='expense' && !isLoading">
        <div class="row" *ngFor="let c of expenseCategories">
          <span class="dot" [style.background]="c.color"></span>
          <div class="name">{{ c.name }}</div>
          <div class="actions">
            <button class="action" aria-label="Edit" (click)="editCategory(c)">
              <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.516 5.13129C14.8684 4.7789 15.0665 4.30093 15.0665 3.80252C15.0666 3.30412 14.8687 2.82609 14.5163 2.47362C14.1639 2.12115 13.6859 1.9231 13.1875 1.92303C12.6891 1.92297 12.2111 2.1209 11.8586 2.47329L2.96129 11.3726C2.80651 11.527 2.69204 11.717 2.62796 11.926L1.74729 14.8273C1.73006 14.8849 1.72876 14.9462 1.74353 15.0045C1.75829 15.0629 1.78857 15.1161 1.83116 15.1586C1.87374 15.2011 1.92704 15.2313 1.9854 15.246C2.04376 15.2607 2.105 15.2593 2.16263 15.242L5.06463 14.362C5.27341 14.2985 5.46341 14.1847 5.61796 14.0306L14.516 5.13129Z" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.4 3.92328L13.0666 6.58995" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="action" aria-label="Delete" (click)="deleteCategory(c)">
              <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.4 4.58997L4.39996 12.59" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.39996 4.58997L12.4 12.59" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div class="list" *ngIf="selectedTab==='income' && !isLoading">
        <div class="row" *ngFor="let c of incomeCategories">
          <span class="dot" [style.background]="c.color"></span>
          <div class="name">{{ c.name }}</div>
          <div class="actions">
            <button class="action" aria-label="Edit" (click)="editCategory(c)">
              <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.516 5.13129C14.8684 4.7789 15.0665 4.30093 15.0665 3.80252C15.0666 3.30412 14.8687 2.82609 14.5163 2.47362C14.1639 2.12115 13.6859 1.9231 13.1875 1.92303C12.6891 1.92297 12.2111 2.1209 11.8586 2.47329L2.96129 11.3726C2.80651 11.527 2.69204 11.717 2.62796 11.926L1.74729 14.8273C1.73006 14.8849 1.72876 14.9462 1.74353 15.0045C1.75829 15.0629 1.78857 15.1161 1.83116 15.1586C1.87374 15.2011 1.92704 15.2313 1.9854 15.246C2.04376 15.2607 2.105 15.2593 2.16263 15.242L5.06463 14.362C5.27341 14.2985 5.46341 14.1847 5.61796 14.0306L14.516 5.13129Z" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.4 3.92328L13.0666 6.58995" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="action" aria-label="Delete" (click)="deleteCategory(c)">
              <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.4 4.58997L4.39996 12.59" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.39996 4.58997L12.4 12.59" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <button class="add-btn" aria-label="Add New Category" (click)="addCategory()">
        <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.92333 8.58997H13.2567" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.59 3.92334V13.2567" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Add New Category
      </button>
    </article>
  `
})
export class CategoryManagementComponent implements OnInit {
  // 🚨 Inject the service
  constructor(private categoryService: CategoryService) { }

  isLoading = false;
  selectedTab: 'expense' | 'income' = 'expense';

  // Categories are now populated from the service
  expenseCategories: Category[] = [];
  incomeCategories: Category[] = [];

  private palette = ['#EF4444', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];

  ngOnInit() {
    this.fetchCategories();
  }

  // New function to handle API fetching
  fetchCategories() {
    this.isLoading = true;
    const type = this.selectedTab;
    this.categoryService.getCategories(type).subscribe({
      next: (data) => {
        if (type === 'expense') {
          this.expenseCategories = data;
        } else {
          this.incomeCategories = data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.isLoading = false;
        // 🚨 IMPORTANT: You must handle the API failure. For now, it logs an error.
      }
    });
  }

  switchTab(tab: 'expense' | 'income') {
    this.selectedTab = tab;
    this.fetchCategories(); // Fetch new list when tab changes
  }

  addCategory() {
    const name = (window.prompt(`Add ${this.selectedTab} category name:`) || '').trim();
    if (!name) return;

    this.isLoading = true;
    const newColor = this.palette[(Math.random() * this.palette.length) | 0];

    // 🚨 Now calls the service to create the category
    this.categoryService.createCategory({ name, type: this.selectedTab, color: newColor }).subscribe({
      next: () => this.fetchCategories(), // Re-fetch the list on success
      error: (err) => {
        console.error('Error creating category:', err);
        this.isLoading = false;
        alert('Failed to add category. Check console for details.');
      }
    });
  }

  // 🚨 Updated to take Category object as input
  editCategory(category: Category) {
    if (!category._id) return alert('Error: Category is missing ID for editing.');

    const newName = (window.prompt('Edit category name:', category.name) || '').trim();
    if (!newName || newName === category.name) return;

    this.isLoading = true;

    // 🚨 Now calls the service to update the category
    this.categoryService.updateCategory(category._id, newName).subscribe({
      next: () => this.fetchCategories(), // Re-fetch the list on success
      error: (err) => {
        console.error('Error updating category:', err);
        this.isLoading = false;
        alert('Failed to update category. Check console for details.');
      }
    });
  }

  // 🚨 Updated to take Category object as input
  deleteCategory(category: Category) {
    if (!category._id) return alert('Error: Category is missing ID for deletion.');

    if (!window.confirm(`Delete "${category.name}"? This action cannot be undone and may affect existing transactions.`)) return;

    this.isLoading = true;

    // 🚨 Now calls the service to delete the category
    this.categoryService.deleteCategory(category._id).subscribe({
      next: () => this.fetchCategories(), // Re-fetch the list on success
      error: (err) => {
        console.error('Error deleting category:', err);
        this.isLoading = false;
        alert('Failed to delete category. Ensure no transactions are linked to it.');
      }
    });
  }
}