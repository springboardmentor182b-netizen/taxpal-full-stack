import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ExpenseModalComponent, ExpenseEmit } from './expense';

describe('ExpenseModalComponent (standalone)', () => {
  let fixture: ComponentFixture<ExpenseModalComponent>;
  let component: ExpenseModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Standalone component: import it, don't declare it
      imports: [ExpenseModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the modal when isOpen=true', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(overlay).toBeTruthy();
  });

  it('should disable Save while the form is invalid', () => {
    component.isOpen = true;
    // leave required fields empty
    component.formData = { description: '', amount: null, category: '', date: '', notes: '' };
    fixture.detectChanges();

    const saveBtn: HTMLButtonElement = fixture.debugElement.query(By.css('.btn-save'))
      .nativeElement;
    expect(saveBtn.disabled).toBeTrue();
  });

  it('should emit save with a valid payload and then reset/close', () => {
    const saveSpy = spyOn(component.save, 'emit');
    const closeSpy = spyOn(component.closeModal, 'emit');

    component.isOpen = true;
    component.formData = {
      description: 'Grocery shopping',
      amount: 123.45,
      category: 'food',
      date: '2025-10-22',
      notes: 'Weekly items',
    };
    fixture.detectChanges();

    // Call directly; onSave itself validates and emits
    component.onSave();

    expect(saveSpy).toHaveBeenCalledTimes(1);
    const payload: ExpenseEmit = saveSpy.calls.mostRecent().args[0] as ExpenseEmit;
    expect(payload).toEqual({
      description: 'Grocery shopping',
      amount: 123.45,
      category: 'food',
      date: '2025-10-22',
      notes: 'Weekly items',
    });
    // onSave calls onClose, which emits closeModal and resets the form
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(component.formData.description).toBe('');
    expect(component.formData.amount).toBeNull();
  });

  it('should emit closeModal when overlay is clicked', () => {
    const closeSpy = spyOn(component.closeModal, 'emit');

    component.isOpen = true;
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    overlay.nativeElement.click(); // triggers (click)="onClose()" on overlay
    fixture.detectChanges();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should NOT close when clicking inside modal-content (stopPropagation)', () => {
    const closeSpy = spyOn(component.closeModal, 'emit');

    component.isOpen = true;
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.modal-content'));
    content.nativeElement.click(); // click is stopped by $event.stopPropagation()
    fixture.detectChanges();

    expect(closeSpy).not.toHaveBeenCalled();
  });
});
