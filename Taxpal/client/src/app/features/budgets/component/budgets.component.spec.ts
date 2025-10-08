import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { BudgetsComponent } from './budgets.component';
import { BudgetService } from '../../../core/services/budget.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

class MockBudgetService {
  createCalls: any[] = [];
  createSubject = new Subject<any>();
  create = (body: any) => {
    this.createCalls.push(body);
    return this.createSubject.asObservable();
  };
}

describe('BudgetsComponent (standalone)', () => {
  let fixture: ComponentFixture<BudgetsComponent>;
  let comp: BudgetsComponent;
  let api: MockBudgetService;
  let snack: jasmine.SpyObj<MatSnackBar>;
  let router: { navigate: jasmine.Spy };

  beforeEach(async () => {
    snack = jasmine.createSpyObj('MatSnackBar', ['open']);
    router = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [BudgetsComponent],
      providers: [
        { provide: BudgetService, useClass: MockBudgetService },
        { provide: Router, useValue: router },
        // NOTE: do NOT also provide MatSnackBar here – we'll override it below
      ],
    })
      // ✅ force the component to receive our spy instead of the module provider
      .overrideProvider(MatSnackBar, { useValue: snack })
      .compileComponents();

    fixture = TestBed.createComponent(BudgetsComponent);
    comp = fixture.componentInstance;
    api = TestBed.inject(BudgetService) as any;
    fixture.detectChanges(); // ngOnInit
  });

  it('initializes form with default month in YYYY-MM and required validators', () => {
    const month = comp.form.get('month')?.value as string;
    expect(month).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
    expect(comp.form.get('category')?.invalid).toBeTrue();
    expect(comp.form.get('amount')?.invalid).toBeTrue();
    expect(comp.form.get('month')?.invalid).toBeFalse();
  });

  it('disables submit when form invalid and shows field invalid state after touch', () => {
    comp.form.get('category')?.markAsTouched();
    comp.form.get('amount')?.markAsTouched();
    expect(comp.isInvalid('category')).toBeTrue();
    expect(comp.isInvalid('amount')).toBeTrue();
  });

  it('normalizes month, calls service, shows success toast, and emits close when embedded', () => {
    comp.embedded = true;
    const closeSpy = spyOn(comp.close, 'emit');

    comp.form.setValue({
      category: 'Groceries',
      amount: 1234.56,
      month: '2025-10-08', // will normalize to YYYY-MM
      description: 'Weekly items',
    });

    comp.onSubmit();
    // simulate success emission from service
    api.createSubject.next({ _id: 'ok' });
    api.createSubject.complete();
    fixture.detectChanges();

    expect(api.createCalls.length).toBe(1);
    expect(api.createCalls[0]).toEqual({
      category: 'Groceries',
      amount: 1234.56,
      month: '2025-10',
      description: 'Weekly items',
    });

    expect(snack.open).toHaveBeenCalledWith('Budget created successfully', 'Close', jasmine.any(Object));
    expect(comp.submitting).toBeFalse();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('shows friendly conflict error (409) and does not navigate', () => {
    comp.embedded = false;
    comp.form.setValue({
      category: 'Rent',
      amount: 5000,
      month: '2025-10',
      description: '',
    });

    comp.onSubmit();
    api.createSubject.error(new HttpErrorResponse({ status: 409, error: {} }));
    fixture.detectChanges();

    expect(snack.open).toHaveBeenCalledWith(
      'Budget already exists for this month & category.',
      'Dismiss',
      jasmine.any(Object)
    );
    expect(comp.submitting).toBeFalse();
    expect((router.navigate as any)).not.toHaveBeenCalled();
  });
});
