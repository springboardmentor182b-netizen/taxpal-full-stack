import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class Categories implements OnInit {
  @Input() open: boolean = false;
  showModal = false;
  selectedTab: 'Income' | 'Expense' = 'Expense';

  defaultCategories: Category[] = [
    { name: 'Salary', type: 'income' },
    { name: 'Freelancing', type: 'income' },
    { name: 'Investments', type: 'income' },
    { name: 'Rental Income', type: 'income' },
    { name: 'Business Profit', type: 'income' },
    { name: 'Rent', type: 'expense' },
    { name: 'Utilities', type: 'expense' },
    { name: 'Groceries', type: 'expense' },
    { name: 'Transportation', type: 'expense' },
    { name: 'Entertainment', type: 'expense' }
  ];

  userCategories: Category[] = [];
  displayedCategories: Category[] = [];
  categoryForm: FormGroup;
  editingCategory: Category | null = null;

  confirmDeleteCategory: Category | null = null; // For delete confirmation modal

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      type: ['income', Validators.required]
    });
  }

  ngOnInit() {
    this.openModal();
    this.loadUserCategories();
  }

  loadUserCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.userCategories = res.data;
        this.filterCategories();
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  filterCategories() {
    const type = this.selectedTab.toLowerCase();
    this.displayedCategories = [...this.defaultCategories, ...this.userCategories]
      .filter(cat => cat.type === type);
  }

  setTab(tab: 'Income' | 'Expense') {
    this.selectedTab = tab;
    this.filterCategories();
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingCategory = null;
    this.categoryForm.reset({ type: 'income' });
    this.categoryForm.setErrors(null);
  }

  addOrUpdateCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const { name, type } = this.categoryForm.value;
    const lowerName = name.trim().toLowerCase();

    // Duplicate check only within the same type
    const allCategories = [...this.defaultCategories, ...this.userCategories];
    const duplicate = allCategories.find(
      cat => cat.type === type && cat.name.toLowerCase() === lowerName && cat !== this.editingCategory
    );

    if (duplicate) {
      this.categoryForm.setErrors({ duplicate: true });
      return;
    }

    if (this.editingCategory && this.editingCategory._id) {
      this.categoryService.updateCategory(this.editingCategory._id, { name, type }).subscribe({
        next: () => this.loadUserCategories(),
        error: (err) => console.error('Error updating category:', err)
      });
    } else {
      this.categoryService.addCategory({ name, type }).subscribe({
        next: () => this.loadUserCategories(),
        error: (err) => console.error('Error adding category:', err)
      });
    }

    this.closeModal();
  }

  editCategory(cat: Category) {
    if (!cat._id) return;
    this.editingCategory = cat;
    this.categoryForm.setValue({ name: cat.name, type: cat.type });
    this.openModal();
  }

  // Delete confirmation logic
  showDeleteConfirm(cat: Category) {
    if (!cat._id) return;
    this.confirmDeleteCategory = cat;
  }

  cancelDelete() {
    this.confirmDeleteCategory = null;
  }

  confirmDelete() {
    if (this.confirmDeleteCategory && this.confirmDeleteCategory._id) {
      this.categoryService.deleteCategory(this.confirmDeleteCategory._id).subscribe({
        next: () => this.loadUserCategories(),
        error: (err) => console.error('Error deleting category:', err)
      });
    }
    this.confirmDeleteCategory = null;
  }
}
