import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BudgetComponent } from './budget.component';

describe('BudgetComponent', () => {
  let component: BudgetComponent;
  let fixture: ComponentFixture<BudgetComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(BudgetComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('form should be valid when amount is provided', () => {
    component.form.controls['amount'].setValue(100);
    expect(component.form.valid).toBeTruthy();
  });

  it('form should be invalid when amount is negative', () => {
    component.form.controls['amount'].setValue(-50);
    expect(component.form.valid).toBeFalsy();
  });

  it('should submit budget when form is valid', () => {
    // Set form value
    component.form.controls['amount'].setValue(200);
    
    // Call onSubmit
    component.onSubmit();
    
    // Expect HTTP request to be made
    const req = httpMock.expectOne('/api/users/add-simple-budget');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ amount: 200 });
    
    // Mock the response
    req.flush({ message: 'Budget added', budget: { amount: 200, _id: '123' } });
    
    // Form should be reset
    expect(component.form.value.amount).toBeNull();
  });
});