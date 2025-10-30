import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IncomeModalComponent } from '../income/income';

describe('IncomeModalComponent', () => {
  let component: IncomeModalComponent;
  let fixture: ComponentFixture<IncomeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomeModalComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display modal when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const modalOverlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modalOverlay).toBeTruthy();
  });

  it('should hide modal when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();

    const modalOverlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modalOverlay).toBeFalsy();
  });

  it('should call onClose() when clicking the overlay', () => {
    component.isOpen = true;
    fixture.detectChanges();

    spyOn(component, 'onClose');
    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    overlay.triggerEventHandler('click', {});
    expect(component.onClose).toHaveBeenCalled();
  });

  it('should prevent modal close when clicking inside content', () => {
    component.isOpen = true;
    fixture.detectChanges();

    spyOn(component, 'onClose');
    const modalContent = fixture.debugElement.query(By.css('.modal-content'));
    modalContent.triggerEventHandler('click', { stopPropagation: () => {} });
    expect(component.onClose).not.toHaveBeenCalled();
  });

  it('should disable Save button when form is invalid', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(By.css('.btn-save')).nativeElement;
    expect(saveButton.disabled).toBeTrue();
  });

  it('should enable Save button when form is valid', () => {
    component.isOpen = true;
    component.formData = {
      description: 'Freelance Project',
      amount: 500,
      category: 'freelance',
      date: '2025-10-05',
      notes: 'Received payment via PayPal',
    };
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(By.css('.btn-save')).nativeElement;
    expect(saveButton.disabled).toBeFalse();
  });

  it('should call onSave() when submitting the form', () => {
    component.isOpen = true;
    fixture.detectChanges();

    spyOn(component, 'onSave');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', {});
    expect(component.onSave).toHaveBeenCalled();
  });
});
