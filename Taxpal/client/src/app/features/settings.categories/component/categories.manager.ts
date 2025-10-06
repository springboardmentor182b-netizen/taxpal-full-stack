import { Component, AfterViewInit } from '@angular/core';

/* ========= Interfaces ========= */
interface Category {
  id: number;
  name: string;
  type: 'expense' | 'income';
}

interface CategoryManagerElements {
  addCategoryBtn: HTMLButtonElement;
  categoryNameInput: HTMLInputElement;
  categoryTypeSelect: HTMLSelectElement;
  expenseCategoriesList: HTMLUListElement;
  incomeCategoriesList: HTMLUListElement;
}

/* ========= Manager (DOM-driven) ========= */
class CategoryManager {
  private categories: Category[] = [];
  private nextId = 6; // after 5 seed categories
  private elements!: CategoryManagerElements;
  private isEditing = false;
  private currentEditId: number | null = null;

  constructor() {
    this.initializeElements();
    this.initializeExistingCategories();
    this.bindEvents();
  }

  private initializeElements(): void {
    this.elements = {
      addCategoryBtn: document.getElementById('add-category-btn') as HTMLButtonElement,
      categoryNameInput: document.getElementById('category-name') as HTMLInputElement,
      categoryTypeSelect: document.getElementById('category-type') as HTMLSelectElement,
      expenseCategoriesList: document.getElementById('expense-categories') as HTMLUListElement,
      incomeCategoriesList: document.getElementById('income-categories') as HTMLUListElement,
    };

    if (
      !this.elements.addCategoryBtn ||
      !this.elements.categoryNameInput ||
      !this.elements.categoryTypeSelect ||
      !this.elements.expenseCategoriesList ||
      !this.elements.incomeCategoriesList
    ) {
      throw new Error('Required DOM elements not found');
    }
  }

  private initializeExistingCategories(): void {
    const existingCategories: Omit<Category, 'id'>[] = [
      { name: 'Business Expenses', type: 'expense' },
      { name: 'Office Rent', type: 'expense' },
      { name: 'Software Subscriptions', type: 'expense' },
      { name: 'Side income', type: 'income' },
      { name: 'Salary', type: 'income' },
    ];

    existingCategories.forEach((category, index) => {
      const withId: Category = { id: index + 1, name: category.name, type: category.type };
      this.categories.push(withId);
      // also render existing if needed
      this.renderCategory(withId);
    });
  }

  private bindEvents(): void {
    this.elements.addCategoryBtn.addEventListener('click', () => this.handleAddCategory());

    // Delegation for edit/delete
    this.elements.expenseCategoriesList.addEventListener('click', (e) => this.handleCategoryAction(e));
    this.elements.incomeCategoriesList.addEventListener('click', (e) => this.handleCategoryAction(e));
  }

  private handleAddCategory(): void {
    const categoryName = this.elements.categoryNameInput.value.trim();
    const categoryType = this.elements.categoryTypeSelect.value as 'expense' | 'income';

    if (!categoryName) {
      alert('Please enter a category name');
      return;
    }
    if (categoryType !== 'expense' && categoryType !== 'income') {
      alert('Please select a valid category type');
      return;
    }

    if (this.isEditing && this.currentEditId !== null) {
      this.updateCategory(this.currentEditId, categoryName, categoryType);
    } else {
      this.addNewCategory(categoryName, categoryType);
    }

    this.resetForm();
  }

  private addNewCategory(name: string, type: 'expense' | 'income'): void {
    const newCategory: Category = { id: this.nextId++, name, type };
    this.categories.push(newCategory);
    this.renderCategory(newCategory);
  }

  private updateCategory(id: number, name: string, type: 'expense' | 'income'): void {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return;

    const old = this.categories[idx];
    this.categories[idx] = { ...old, name, type };

    if (old.type !== type) {
      this.removeCategoryFromDOM(id);
      this.renderCategory(this.categories[idx]);
    } else {
      const el = document.querySelector(`[data-id="${id}"] .category-name`) as HTMLElement | null;
      if (el) el.textContent = name;
    }

    this.cancelEdit();
  }

  private handleCategoryAction(event: Event): void {
    const target = event.target as HTMLElement;
    const categoryItem = target.closest('.category-item') as HTMLLIElement | null;
    if (!categoryItem) return;

    // TS4111 fix: dataset uses index signature
    const categoryId = parseInt(categoryItem.dataset['id'] ?? '0', 10);
    if (!categoryId) return;

    if (target.classList.contains('delete-btn')) {
      this.deleteCategory(categoryId);
    } else if (target.classList.contains('edit-btn')) {
      this.startEdit(categoryId);
    }
  }

  private deleteCategory(id: number): void {
    if (!confirm('Are you sure you want to delete this category?')) return;
    this.categories = this.categories.filter((c) => c.id !== id);
    this.removeCategoryFromDOM(id);
  }

  private startEdit(id: number): void {
    if (this.isEditing) this.cancelEdit();

    const category = this.categories.find((c) => c.id === id);
    if (!category) return;

    this.isEditing = true;
    this.currentEditId = id;

    this.elements.categoryNameInput.value = category.name;
    this.elements.categoryTypeSelect.value = category.type;
    this.elements.addCategoryBtn.textContent = 'Update Category';

    const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement | null;
    el?.classList.add('edit-mode');
  }

  private cancelEdit(): void {
    this.isEditing = false;
    this.currentEditId = null;
    this.resetForm();

    document.querySelectorAll('.edit-mode').forEach((el) => el.classList.remove('edit-mode'));
  }

  private resetForm(): void {
    this.elements.categoryNameInput.value = '';
    this.elements.categoryTypeSelect.value = 'expense';
    this.elements.addCategoryBtn.textContent = 'Add Category';
  }

  private renderCategory(category: Category): void {
    const li = document.createElement('li');
    li.className = 'category-item';
    // TS4111 fix here too
    li.dataset['id'] = String(category.id);

    li.innerHTML = `
      <span class="category-name">${this.escapeHtml(category.name)}</span>
      <div class="category-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    const list =
      category.type === 'expense' ? this.elements.expenseCategoriesList : this.elements.incomeCategoriesList;
    list.appendChild(li);
  }

  private removeCategoryFromDOM(id: number): void {
    const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement | null;
    el?.remove();
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  public getCategories(): Category[] {
    return [...this.categories];
  }
}

/* ========= Angular Component wrapper ========= */
@Component({
  selector: 'app-settings-categories',
  templateUrl: './settings.categories.component.html',
  styleUrls: ['./settings.categories.component.css'],
  standalone: true,
})
export class SettingsCategoriesComponent implements AfterViewInit {
  private manager!: CategoryManager;

  ngAfterViewInit(): void {
    // Instantiate after the template is rendered
    this.manager = new CategoryManager();
  }
}
