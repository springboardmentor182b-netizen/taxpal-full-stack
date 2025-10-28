import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaxEstimatorFormComponent } from './tax-estimator-form.component';
import { AuthService, User } from '../../../features/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('TaxEstimatorFormComponent', () => {
  let component: TaxEstimatorFormComponent;
  let fixture: ComponentFixture<TaxEstimatorFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    fullName: 'rupak', email: 'rupak@gmail.com',
    id: '',
    username: ''
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceSpy.getCurrentUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [TaxEstimatorFormComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxEstimatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle collapse state', () => {
    expect(component.collapsed).toBeFalse();
    component.toggleCollapse();
    expect(component.collapsed).toBeTrue();
    component.toggleCollapse();
    expect(component.collapsed).toBeFalse();
  });

  it('should update form fields correctly', () => {
    component.updateFormField('grossIncome', 1000);
    component.updateFormField('state', 'Texas');

    const form = component.taxForm();
    expect(form.grossIncome).toBe(1000);
    expect(form.state).toBe('Texas');
  });

  it('should calculate tax correctly', () => {
    component.updateFormField('grossIncome', 2000);
    component.updateFormField('deductions', 200);
    component.updateFormField('retirementContributions', 100);
    component.updateFormField('healthInsurancePremiums', 50);
    component.updateFormField('homeOfficeDeduction', 150);

    component.calculateTax();

    const form = component.taxForm();
    const taxable = 2000 - (200 + 100 + 50 + 150); // 1500
    expect(form.calculatedTax).toBe(taxable * 0.25); // 375
  });

  it('should return correct tax summary message', () => {
    expect(component.taxSummaryMessage()).toContain('Enter your income');

    component.taxForm.update(f => ({ ...f, calculatedTax: 500 }));
    expect(component.taxSummaryMessage()).toContain('Your estimated quarterly tax');
  });

  it('should return user initials', () => {
    expect(component.userInitials()).toBe('JD');

    component.currentUser = null;
    expect(component.userInitials()).toBe('');
  });

  it('should set active view correctly', () => {
    expect(component.activeView()).toBe('calculator');
    component.setActiveView('calendar');
    expect(component.activeView()).toBe('calendar');
  });

  it('should track month and reminder correctly', () => {
    const month = { month: 'June 2025', reminders: [] };
    const reminder = { id: '1', date: 'Jun 1', title: 'Test', description: '', type: 'payment' as 'payment' | 'reminder' };

    expect(component.trackByMonth(0, month)).toBe('June 2025');
    expect(component.trackByReminderId(0, reminder)).toBe('1');
  });

  it('should load current user on init', () => {
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should call logout and navigate on success', fakeAsync(() => {
    authServiceSpy.logout.and.returnValue(of({}));
    component.logout();
    tick();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should call logout and navigate on error', fakeAsync(() => {
    authServiceSpy.logout.and.returnValue(throwError(() => new Error('Fail')));
    component.logout();
    tick();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
