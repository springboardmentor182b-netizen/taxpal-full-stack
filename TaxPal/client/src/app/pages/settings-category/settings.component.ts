import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

interface Category { name: string; color: string; }

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgFor, NgIf],
  styleUrls: ['./settings.component.css'],
  template: `
    <!-- Subheader -->
    <section class="subheader">
      <div class="container row">
        <div>
          <button class="back" aria-label="Back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.99998 13.4567L3.33331 8.78999L7.99998 4.12332" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.6666 8.78998H3.33331" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back
          </button>
          <h2 class="page-title">Settings</h2>
          <div class="page-desc">Manage your account settings and preferences</div>
        </div>
      </div>
    </section>

    <main class="main">
      <div class="container">
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

          <div class="list" *ngIf="selectedTab==='expense'">
            <div class="row" *ngFor="let c of expenseCategories; let i = index">
              <span class="dot" [style.background]="c.color"></span>
              <div class="name">{{ c.name }}</div>
              <div class="actions">
                <button class="action" aria-label="Edit" (click)="editCategory('expense', i)">
                  <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.516 5.13129C14.8684 4.7789 15.0665 4.30093 15.0665 3.80252C15.0666 3.30412 14.8687 2.82609 14.5163 2.47362C14.1639 2.12115 13.6859 1.9231 13.1875 1.92303C12.6891 1.92297 12.2111 2.1209 11.8586 2.47329L2.96129 11.3726C2.80651 11.527 2.69204 11.717 2.62796 11.926L1.74729 14.8273C1.73006 14.8849 1.72876 14.9462 1.74353 15.0045C1.75829 15.0629 1.78857 15.1161 1.83116 15.1586C1.87374 15.2011 1.92704 15.2313 1.9854 15.246C2.04376 15.2607 2.105 15.2593 2.16263 15.242L5.06463 14.362C5.27341 14.2985 5.46341 14.1847 5.61796 14.0306L14.516 5.13129Z" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.4 3.92328L13.0666 6.58995" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="action" aria-label="Delete" (click)="deleteCategory('expense', i)">
                  <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.4 4.58997L4.39996 12.59" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.39996 4.58997L12.4 12.59" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="list" *ngIf="selectedTab==='income'">
            <div class="row" *ngFor="let c of incomeCategories; let i = index">
              <span class="dot" [style.background]="c.color"></span>
              <div class="name">{{ c.name }}</div>
              <div class="actions">
                <button class="action" aria-label="Edit" (click)="editCategory('income', i)">
                  <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.516 5.13129C14.8684 4.7789 15.0665 4.30093 15.0665 3.80252C15.0666 3.30412 14.8687 2.82609 14.5163 2.47362C14.1639 2.12115 13.6859 1.9231 13.1875 1.92303C12.6891 1.92297 12.2111 2.1209 11.8586 2.47329L2.96129 11.3726C2.80651 11.527 2.69204 11.717 2.62796 11.926L1.74729 14.8273C1.73006 14.8849 1.72876 14.9462 1.74353 15.0045C1.75829 15.0629 1.78857 15.1161 1.83116 15.1586C1.87374 15.2011 1.92704 15.2313 1.9854 15.246C2.04376 15.2607 2.105 15.2593 2.16263 15.242L5.06463 14.362C5.27341 14.2985 5.46341 14.1847 5.61796 14.0306L14.516 5.13129Z" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.4 3.92328L13.0666 6.58995" stroke="#64748B" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="action" aria-label="Delete" (click)="deleteCategory('income', i)">
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
      </div>
    </main>
  `
})
export class SettingsComponent {
  selectedTab: 'expense' | 'income' = 'expense';

  expenseCategories: Category[] = [
    { name: 'Business Expenses', color: '#EF4444' },
    { name: 'Office Rent', color: '#3B82F6' },
    { name: 'Software Subscriptions', color: '#8B5CF6' },
    { name: 'Professional Development', color: '#10B981' },
    { name: 'Marketing', color: '#F59E0B' },
    { name: 'Travel', color: '#EC4899' },
    { name: 'Meals & Entertainment', color: '#6366F1' },
    { name: 'Utilities', color: '#EF4444' }
  ];

  incomeCategories: Category[] = [
    { name: 'Consulting Income', color: '#10B981' },
    { name: 'Product Sales', color: '#3B82F6' },
    { name: 'Interest Income', color: '#F59E0B' },
    { name: 'Refunds', color: '#8B5CF6' },
    { name: 'Other Income', color: '#6366F1' }
  ];

  private palette = ['#EF4444','#3B82F6','#8B5CF6','#10B981','#F59E0B','#EC4899','#6366F1'];

  switchTab(tab: 'expense' | 'income') {
    this.selectedTab = tab;
  }

  addCategory() {
    const name = (window.prompt(`Add ${this.selectedTab} category name:`) || '').trim();
    if (!name) return;
    const color = this.palette[(Math.random()*this.palette.length)|0];
    const list = this.selectedTab === 'expense' ? this.expenseCategories : this.incomeCategories;
    list.push({ name, color });
  }

  editCategory(tab: 'expense'|'income', index: number) {
    const list = tab === 'expense' ? this.expenseCategories : this.incomeCategories;
    const current = list[index];
    const name = (window.prompt('Edit category name:', current.name) || '').trim();
    if (!name) return;
    list[index] = { ...current, name };
  }

  deleteCategory(tab: 'expense'|'income', index: number) {
    const list = tab === 'expense' ? this.expenseCategories : this.incomeCategories;
    const c = list[index];
    if (window.confirm(`Delete "${c.name}"?`)) list.splice(index, 1);
  }
}
