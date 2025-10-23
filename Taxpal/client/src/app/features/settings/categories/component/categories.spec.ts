import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { SettingsCategoriesComponent } from './categories';
import { CategoryService } from '@/app/core/services/category.service';

describe('SettingsCategoriesComponent', () => {
  let component: SettingsCategoriesComponent;
  let fixture: ComponentFixture<SettingsCategoriesComponent>;

  // Simple mock for CategoryService
  const mockCategoryService = {
    getCategories: jasmine.createSpy('getCategories').and.returnValue(of([])),
    createCategory: jasmine.createSpy('createCategory').and.returnValue(of({})),
    updateCategory: jasmine.createSpy('updateCategory').and.returnValue(of({})),
    deleteCategory: jasmine.createSpy('deleteCategory').and.returnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Standalone component goes in `imports`
      imports: [SettingsCategoriesComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit -> loadCategories()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockCategoryService.getCategories).toHaveBeenCalled();
  });
});
