import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with expense tab selected', () => {
    expect(component.selectedTab).toBe('expense');
  });

  it('should switch tabs', () => {
    component.switchTab('income');
    expect(component.selectedTab).toBe('income');
    component.switchTab('expense');
    expect(component.selectedTab).toBe('expense');
  });

  it('should add a category when valid name is provided', () => {
    // Mock window.prompt to return a test category name
    spyOn(window, 'prompt').and.returnValue('Test Category');
    
    const initialLength = component.expenseCategories.length;
    component.addCategory();
    
    expect(component.expenseCategories.length).toBe(initialLength + 1);
    expect(component.expenseCategories[component.expenseCategories.length - 1].name).toBe('Test Category');
  });

  it('should not add a category when empty name is provided', () => {
    // Mock window.prompt to return empty string
    spyOn(window, 'prompt').and.returnValue('');
    
    const initialLength = component.expenseCategories.length;
    component.addCategory();
    
    expect(component.expenseCategories.length).toBe(initialLength);
  });

  it('should edit a category when valid name is provided', () => {
    // Mock window.prompt to return a new category name
    spyOn(window, 'prompt').and.returnValue('Edited Category');
    
    component.editCategory('expense', 0);
    
    expect(component.expenseCategories[0].name).toBe('Edited Category');
  });

  it('should not edit a category when empty name is provided', () => {
    // Save original name
    const originalName = component.expenseCategories[0].name;
    
    // Mock window.prompt to return empty string
    spyOn(window, 'prompt').and.returnValue('');
    
    component.editCategory('expense', 0);
    
    expect(component.expenseCategories[0].name).toBe(originalName);
  });

  it('should delete a category when confirmed', () => {
    // Save the category to be deleted
    const categoryToDelete = component.expenseCategories[0];
    const initialLength = component.expenseCategories.length;
    
    // Mock window.confirm to return true
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.deleteCategory('expense', 0);
    
    expect(component.expenseCategories.length).toBe(initialLength - 1);
    expect(component.expenseCategories[0]).not.toEqual(categoryToDelete);
  });

  it('should not delete a category when not confirmed', () => {
    const initialLength = component.expenseCategories.length;
    
    // Mock window.confirm to return false
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteCategory('expense', 0);
    
    expect(component.expenseCategories.length).toBe(initialLength);
  });
});
