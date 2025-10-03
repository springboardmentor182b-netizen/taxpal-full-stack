import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesComponent } from './categories.component';
import { CategoryService, Category } from '../../../services/category.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

// ✅ Mock CategoryService
class MockCategoryService {
  mockCategories: Category[] = [
    { _id: '1', name: 'Food', type: 'expense', color: '#ff0000' },
    { _id: '2', name: 'Salary', type: 'income', color: '#00ff00' }
  ];

  getCategories() {
    return of({ data: this.mockCategories });
  }

  addCategory(category: Category) {
    this.mockCategories.push({ ...category, _id: String(Date.now()) });
    return of({ message: 'Category added' });
  }

  updateCategory(id: string, category: Partial<Category>) {
    const idx = this.mockCategories.findIndex(c => c._id === id);
    if (idx > -1) this.mockCategories[idx] = { ...this.mockCategories[idx], ...category };
    return of({ message: 'Category updated' });
  }

  deleteCategory(id: string) {
    this.mockCategories = this.mockCategories.filter(c => c._id !== id);
    return of({ message: 'Category deleted' });
  }
}

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let service: MockCategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      declarations: [],
      providers: [{ provide: CategoryService, useClass: MockCategoryService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CategoryService) as any;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    component.ngOnInit();
    expect(component.expenseCategories.length).toBeGreaterThan(0);
    expect(component.incomeCategories.length).toBeGreaterThan(0);
  });

  it('should add a new category', () => {
    const initialCount = service.mockCategories.length;
    component.newCategoryName = 'Test Category';
    component.newCategoryType = 'expense';
    component.addCategory();
    expect(service.mockCategories.length).toBe(initialCount + 1);
  });

  it('should delete a category', () => {
    const categoryToDelete = service.mockCategories[0];
    component.deleteCategory(categoryToDelete);
    expect(service.mockCategories.find(c => c._id === categoryToDelete._id)).toBeUndefined();
  });
});
