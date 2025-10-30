import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CategoryService, Category } from '@/app/core/services/category.service';

@Component({
  selector: 'app-settings-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, RouterLinkActive],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsCategoriesComponent implements OnInit {
  categories: Category[] = [];

  categoryName = '';
  categoryType: 'expense' | 'income' = 'expense';

  isEditing = false;
  currentEditId: string | null = null;

  isLoading = false;
  error = '';
  private isOffline = false;

  /** Mobile/tablet drawer state */
  mobileNavOpen = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() { this.loadCategories(); }

  // ===== Drawer controls =====
  toggleDrawer(): void { this.mobileNavOpen = !this.mobileNavOpen; }
  closeDrawer(): void { this.mobileNavOpen = false; }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.mobileNavOpen) {
      e.preventDefault();
      this.closeDrawer();
    }
  }

  // ===== Helpers (UI duplicate guard) =====
  private normalize(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  private isDuplicate(name: string, type: 'expense' | 'income', excludeId?: string | null): boolean {
    const n = this.normalize(name);
    return this.categories.some(c =>
      c.type === type &&
      this.normalize(c.name) === n &&
      (!excludeId || (c as any)._id !== excludeId)
    );
  }

  // ===== Load =====
  loadCategories(): void {
    this.isLoading = true;
    this.error = '';
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats ?? [];
        this.isOffline = false;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Server not reachable — showing local categories.';
        this.isOffline = true;
        this.seedLocal();
        this.isLoading = false;
      }
    });
  }

  // ===== Add / Update =====
  handleAddCategory(): void {
    const name = this.categoryName.trim();
    const type = this.categoryType;

    if (!name) { alert('Please enter a category name'); return; }

    // Client-side duplicate check (case-insensitive, ignore extra spaces)
    if (!this.isEditing && this.isDuplicate(name, type)) {
      alert('Category already exists for this type.');
      return;
    }
    if (this.isEditing && this.currentEditId && this.isDuplicate(name, type, this.currentEditId)) {
      alert('Another category with the same name and type already exists.');
      return;
    }

    if (this.isEditing && this.currentEditId) {
      this.updateCategory(this.currentEditId, name, type);
    } else {
      this.addNewCategory(name, type);
    }
  }

  private addNewCategory(name: string, type: 'expense' | 'income'): void {
    this.isLoading = true;

    if (this.isOffline) {
      if (this.isDuplicate(name, type)) {
        alert('Category already exists for this type.');
        this.isLoading = false; return;
      }
      this.categories = [...this.categories, { _id: this.genId(), name, type }];
      this.resetForm(); this.isLoading = false; return;
    }

    this.categoryService.createCategory({ name, type }).subscribe({
      next: () => { this.loadCategories(); this.resetForm(); this.isLoading = false; },
      error: (err) => {
        // If server says duplicate, surface message
        if (typeof err === 'string' && /already exists/i.test(err)) {
          alert('Category already exists for this type.');
        } else {
          this.isOffline = true;
          this.error = 'Server not reachable — saved locally for now.';
          // Still guard against duplicate locally
          if (!this.isDuplicate(name, type)) {
            this.categories = [...this.categories, { _id: this.genId(), name, type }];
          }
        }
        this.resetForm(); this.isLoading = false;
      }
    });
  }

  private updateCategory(id: string, name: string, type: 'expense' | 'income'): void {
    this.isLoading = true;

    if (this.isOffline) {
      if (this.isDuplicate(name, type, id)) {
        alert('Another category with the same name and type already exists.');
        this.isLoading = false; return;
      }
      this.categories = this.categories.map(c => c._id === id ? ({ ...c, name, type }) : c);
      this.cancelEdit(); this.isLoading = false; return;
    }

    this.categoryService.updateCategory(id, { name, type }).subscribe({
      next: () => { this.loadCategories(); this.cancelEdit(); this.isLoading = false; },
      error: (err) => {
        if (typeof err === 'string' && /already exists/i.test(err)) {
          alert('Another category with the same name and type already exists.');
        } else {
          this.isOffline = true;
          this.error = 'Server not reachable — updated locally for now.';
          if (!this.isDuplicate(name, type, id)) {
            this.categories = this.categories.map(c => c._id === id ? ({ ...c, name, type }) : c);
          }
        }
        this.cancelEdit(); this.isLoading = false;
      }
    });
  }

  // ===== Delete =====
  deleteCategory(id: string): void {
    if (!confirm('Are you sure you want to delete this category?')) return;
    this.isLoading = true;

    if (this.isOffline) {
      this.categories = this.categories.filter(c => c._id !== id);
      this.isLoading = false; return;
    }

    this.categoryService.deleteCategory(id).subscribe({
      next: () => { this.loadCategories(); this.isLoading = false; },
      error: () => {
        this.isOffline = true;
        this.error = 'Server not reachable — deleted locally for now.';
        this.categories = this.categories.filter(c => c._id !== id);
        this.isLoading = false;
      }
    });
  }

  // ===== Edit helpers =====
  startEdit(id: string): void {
    if (this.isEditing) this.cancelEdit();
    const cat = this.categories.find(c => (c as any)._id === id);
    if (!cat) return;

    this.isEditing = true;
    this.currentEditId = id;
    this.categoryName = cat.name;
    this.categoryType = cat.type;

    setTimeout(() => {
      document.querySelector('.add-category-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      (document.getElementById('category-name') as HTMLInputElement | null)?.focus();
    }, 0);
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentEditId = null;
    this.resetForm();
  }

  private resetForm(): void {
    this.categoryName = '';
    this.categoryType = 'expense';
  }

  // ===== Local seed & utils =====
  private seedLocal(): void {
    const seed: Omit<Category, '_id'>[] = [
      { name: 'Business Expenses', type: 'expense' },
      { name: 'Office Rent', type: 'expense' },
      { name: 'Software Subscriptions', type: 'expense' },
      { name: 'Side income', type: 'income' },
      { name: 'Salary', type: 'income' }
    ];
    this.categories = seed.map((c, i) => ({ ...c, _id: String(i + 1) }));
  }

  private genId(): string {
    const v4 = (globalThis as any)?.crypto?.randomUUID?.();
    return v4 ? v4 : `tmp_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  }

  // View helpers
  getExpenseCategories(): Category[] { return this.categories.filter(c => c.type === 'expense'); }
  getIncomeCategories(): Category[] { return this.categories.filter(c => c.type === 'income'); }
  trackById(_i: number, c: Category) { return (c as any)._id || `${c.name}:${c.type}`; }
}
