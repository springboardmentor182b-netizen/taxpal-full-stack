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

  /** 🔹 Default categories (always available) */
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

  /** 🔹 User-created categories from backend */
  userCategories: Category[] = [];

  /** 🔹 Categories to display for current tab */
  displayedCategories: Category[] = [];

  categoryForm: FormGroup;
  editingCategory: Category | null = null;

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      type: ['income', Validators.required] // backend expects lowercase
    });
  }

  ngOnInit() {
    this.openModal();
    this.loadUserCategories();
  }

  /** 🔹 Load backend categories */
  loadUserCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.userCategories = res.data;
        this.filterCategories(); // show categories for selected tab
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  /** 🔹 Filter categories based on selected tab */
  filterCategories() {
    const type = this.selectedTab.toLowerCase(); // 'income' or 'expense'
    this.displayedCategories = [...this.defaultCategories, ...this.userCategories]
      .filter(cat => cat.type === type);
  }

  /** 🔹 Switch tab */
  setTab(tab: 'Income' | 'Expense') {
    this.selectedTab = tab;
    this.filterCategories();
  }

  /** 🔹 Modal control */
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingCategory = null;
    this.categoryForm.reset({ type: 'income' });
  }

  /** 🔹 Add or update category */
  addOrUpdateCategory() {
    if (this.categoryForm.invalid) return;
    const { name, type } = this.categoryForm.value;

    if (this.editingCategory && this.editingCategory._id) {
      // Update backend category
      this.categoryService.updateCategory(this.editingCategory._id, { name, type }).subscribe({
        next: () => this.loadUserCategories(),
        error: (err) => console.error('Error updating category:', err)
      });
    } else {
      // Add new category to backend
      this.categoryService.addCategory({ name, type }).subscribe({
        next: () => this.loadUserCategories(),
        error: (err) => console.error('Error adding category:', err)
      });
    }
    this.closeModal();
  }

  /** 🔹 Edit only user-created category */
  editCategory(cat: Category) {
    if (!cat._id) return; // prevent editing defaults
    this.editingCategory = cat;
    this.categoryForm.setValue({ name: cat.name, type: cat.type });
    this.openModal();
  }

  /** 🔹 Delete only user-created category */
  deleteCategory(cat: Category) {
    if (!cat._id) return; // prevent deleting defaults
    this.categoryService.deleteCategory(cat._id).subscribe({
      next: () => this.loadUserCategories(),
      error: (err) => console.error('Error deleting category:', err)
    });
  }
}
