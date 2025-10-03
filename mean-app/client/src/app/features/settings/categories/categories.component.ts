import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Category, CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  activeTab: 'profile' | 'categories' | 'notifications' | 'security' = 'categories';

  expenseCategories: Category[] = [];
  incomeCategories: Category[] = [];
  newCategoryName = '';
  newCategoryType: 'expense' | 'income' = 'expense';
  newCategoryColor = '#1976d2';
  loading = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  setTab(tab: 'profile' | 'categories' | 'notifications' | 'security') {
    this.activeTab = tab;
  }

  trackById(index: number, cat: Category) {
    return cat._id;
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.expenseCategories = res.data.filter(c => c.type === 'expense');
        this.incomeCategories = res.data.filter(c => c.type === 'income');
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.loading = false;
      }
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim() || !this.newCategoryType) return;

    const category: Category = {
      name: this.newCategoryName.trim(),
      type: this.newCategoryType,
      color: this.newCategoryColor
    };

    this.categoryService.addCategory(category).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.newCategoryColor = '#1976d2';
        this.loadCategories();
      },
      error: (err) => alert(err.error?.message || 'Failed to add category')
    });
  }

  editCategory(cat: Category) {
    const newName = prompt('Update category name', cat.name);
    if (newName && newName !== cat.name) {
      this.categoryService.updateCategory(cat._id!, { name: newName }).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert(err.error?.message || 'Failed to update category')
      });
    }
  }

  deleteCategory(cat: Category) {
    if (confirm(`Delete category "${cat.name}"?`)) {
      this.categoryService.deleteCategory(cat._id!).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert(err.error?.message || 'Failed to delete category')
      });
    }
  }
}
