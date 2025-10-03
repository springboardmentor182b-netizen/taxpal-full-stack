import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
  type: 'Income' | 'Expense';
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class Categories implements OnInit {
  showModal = false;
  selectedTab: 'Income' | 'Expense' = 'Expense';

  categories: Category[] = [
    { id: 1, name: 'Salary', type: 'Income' },
    { id: 2, name: 'Freelancing', type: 'Income' },
    { id: 3, name: 'Investments', type: 'Income' },
    { id: 4, name: 'Rental Income', type: 'Income' },
    { id: 5, name: 'Business Profit', type: 'Income' },
    { id: 6, name: 'Rent', type: 'Expense' },
    { id: 7, name: 'Utilities', type: 'Expense' },
    { id: 8, name: 'Groceries', type: 'Expense' },
    { id: 9, name: 'Transportation', type: 'Expense' },
    { id: 10, name: 'Entertainment', type: 'Expense' }
  ];

  categoryForm: FormGroup;
  editingCategory: Category | null = null;

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      type: ['Income', Validators.required]
    });
  }

  ngOnInit() {
    this.openModal(); // ✅ auto-open when component loads
  }

  setTab(tab: 'Income' | 'Expense') {
    this.selectedTab = tab;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingCategory = null;
    this.categoryForm.reset({ type: 'Income' });
  }

  addOrUpdateCategory() {
    if (this.categoryForm.invalid) return;
    const { name, type } = this.categoryForm.value;

    if (this.editingCategory) {
      this.editingCategory.name = name;
      this.editingCategory.type = type;
    } else {
      this.categories.push({ id: Date.now(), name, type });
    }
    this.closeModal();
  }

  editCategory(cat: Category) {
    this.editingCategory = cat;
    this.categoryForm.setValue({ name: cat.name, type: cat.type });
    this.openModal();
  }

  deleteCategory(cat: Category) {
    this.categories = this.categories.filter(c => c.id !== cat.id);
  }
}
