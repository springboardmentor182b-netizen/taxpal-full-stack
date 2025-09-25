import { Component, OnInit } from '@angular/core';

Component({
  selector: 'app-settings-categories',
  templateUrl: './settings.categories.component.html',
  styleUrls: ['./settings.categories.component.css']
})

// Interface definitions
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

class CategoryManager {
    private categories: Category[] = [];
    private nextId: number = 6; // Starting from 6 since we have 5 existing categories
    private elements!: CategoryManagerElements;
    private isEditing: boolean = false;
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
            incomeCategoriesList: document.getElementById('income-categories') as HTMLUListElement
        };

        // Validate that all elements exist
        if (!this.elements.addCategoryBtn || !this.elements.categoryNameInput || 
            !this.elements.categoryTypeSelect || !this.elements.expenseCategoriesList || 
            !this.elements.incomeCategoriesList) {
            throw new Error('Required DOM elements not found');
        }
    }

    private initializeExistingCategories(): void {
        // Initialize with existing categories from HTML
        const existingCategories: Omit<Category, 'id'>[] = [
            { name: 'Business Expenses', type: 'expense' },
            { name: 'Office Rent', type: 'expense' },
            { name: 'Software Subscriptions', type: 'expense' },
            { name: 'Side income', type: 'income' },
            { name: 'Salary', type: 'income' }
        ];

        existingCategories.forEach((category, index) => {
            const categoryWithId: Category = {
                id: index + 1,
                name: category.name,
                type: category.type
            };
            this.categories.push(categoryWithId);
        });
    }

    private bindEvents(): void {
        this.elements.addCategoryBtn.addEventListener('click', () => this.handleAddCategory());
        
        // Event delegation for edit and delete buttons
        this.elements.expenseCategoriesList.addEventListener('click', (e) => this.handleCategoryAction(e));
        this.elements.incomeCategoriesList.addEventListener('click', (e) => this.handleCategoryAction(e));
    }

    private handleAddCategory(): void {
        const categoryName = this.elements.categoryNameInput.value.trim();
        const categoryType = this.elements.categoryTypeSelect.value as 'expense' | 'income';

        if (categoryName === '') {
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
        const newCategory: Category = {
            id: this.nextId++,
            name: name,
            type: type
        };

        this.categories.push(newCategory);
        this.renderCategory(newCategory);
    }

    private updateCategory(id: number, name: string, type: 'expense' | 'income'): void {
        const categoryIndex = this.categories.findIndex(cat => cat.id === id);
        
        if (categoryIndex !== -1) {
            const oldCategory = this.categories[categoryIndex];
            this.categories[categoryIndex] = { ...oldCategory, name, type };
            
            // If type changed, move the category to the correct list
            if (oldCategory.type !== type) {
                this.removeCategoryFromDOM(id);
                this.renderCategory(this.categories[categoryIndex]);
            } else {
                // Just update the name in the existing element
                const categoryElement = document.querySelector(`[data-id="${id}"] .category-name`) as HTMLElement;
                if (categoryElement) {
                    categoryElement.textContent = name;
                }
            }
        }

        this.cancelEdit();
    }

    private handleCategoryAction(event: Event): void {
        const target = event.target as HTMLElement;
        const categoryItem = target.closest('.category-item') as HTMLLIElement;
        
        if (!categoryItem) return;

        const categoryId = parseInt(categoryItem.dataset.id || '0');
        
        if (target.classList.contains('delete-btn')) {
            this.deleteCategory(categoryId);
        } else if (target.classList.contains('edit-btn')) {
            this.startEdit(categoryId);
        }
    }

    private deleteCategory(id: number): void {
        if (confirm('Are you sure you want to delete this category?')) {
            this.categories = this.categories.filter(cat => cat.id !== id);
            this.removeCategoryFromDOM(id);
        }
    }

    private startEdit(id: number): void {
        if (this.isEditing) {
            this.cancelEdit();
        }

        const category = this.categories.find(cat => cat.id === id);
        if (!category) return;

        this.isEditing = true;
        this.currentEditId = id;
        
        // Update form fields
        this.elements.categoryNameInput.value = category.name;
        this.elements.categoryTypeSelect.value = category.type;
        this.elements.addCategoryBtn.textContent = 'Update Category';

        // Highlight the category being edited
        const categoryElement = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
        if (categoryElement) {
            categoryElement.classList.add('edit-mode');
        }
    }

    private cancelEdit(): void {
        this.isEditing = false;
        this.currentEditId = null;
        this.resetForm();
        
        // Remove edit mode styling from all categories
        const editModeElements = document.querySelectorAll('.edit-mode');
        editModeElements.forEach(element => element.classList.remove('edit-mode'));
    }

    private resetForm(): void {
        this.elements.categoryNameInput.value = '';
        this.elements.categoryTypeSelect.value = 'expense';
        this.elements.addCategoryBtn.textContent = 'Add Category';
        this.isEditing = false;
        this.currentEditId = null;
    }

    private renderCategory(category: Category): void {
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category-item';
        categoryItem.dataset.id = category.id.toString();
        
        categoryItem.innerHTML = `
            <span class="category-name">${this.escapeHtml(category.name)}</span>
            <div class="category-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        const targetList = category.type === 'expense' 
            ? this.elements.expenseCategoriesList 
            : this.elements.incomeCategoriesList;
        
        targetList.appendChild(categoryItem);
    }

    private removeCategoryFromDOM(id: number): void {
        const categoryElement = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
        if (categoryElement) {
            categoryElement.remove();
        }
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Public method to get all categories (for potential future use)
    public getCategories(): Category[] {
        return [...this.categories];
    }
}

// Initialize the category manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new CategoryManager();
    } catch (error) {
        console.error('Failed to initialize CategoryManager:', error);
    }
});