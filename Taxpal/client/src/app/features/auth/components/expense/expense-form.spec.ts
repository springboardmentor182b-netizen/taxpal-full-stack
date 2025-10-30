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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModal when onClose() is called', () => {
    const closeSpy = spyOn(component.closeModal, 'emit');
    component.onClose();
    expect(closeSpy).toHaveBeenCalled();
  });
});
