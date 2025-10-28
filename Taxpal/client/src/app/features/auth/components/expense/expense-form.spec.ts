import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseModalComponent } from './expense';

describe('ExpenseModalComponent (basic spec)', () => {
  let fixture: ComponentFixture<ExpenseModalComponent>;
  let component: ExpenseModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseModalComponent], // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should reject negative amount and set error', () => {
    spyOn(component.save, 'emit');
    component.formData.description = 'something';
    component.formData.category = 'General';
    component.formData.date = '2025-10-28';
    component.formData.amount = -50;
    component.onSaveClicked();
    expect(component.save.emit).not.toHaveBeenCalled();
    expect(component.errors.amount).toBeTruthy();
    expect(component.errors.amount).toContain('greater than 0');
  });

  it('should require description and category', () => {
    spyOn(component.save, 'emit');
    component.formData.amount = 100;
    component.formData.date = '2025-10-28';
    component.formData.description = ''; // missing
    component.formData.category = ''; // missing
    component.onSaveClicked();
    expect(component.save.emit).not.toHaveBeenCalled();
    expect(component.errors.description).toBeTruthy();
    expect(component.errors.category).toBeTruthy();
  });

  it('should emit when valid', () => {
    spyOn(component.save, 'emit');
    component.formData = { description: 'desc', amount: 200, category: 'cat', date: '2025-10-28', notes: '' };
    component.onSaveClicked();
    expect(component.save.emit).toHaveBeenCalled();
  });
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModal when onClose() is called', () => {
    const closeSpy = spyOn(component.closeModal, 'emit');
    component.onClose();
    expect(closeSpy).toHaveBeenCalled();
  });
});
