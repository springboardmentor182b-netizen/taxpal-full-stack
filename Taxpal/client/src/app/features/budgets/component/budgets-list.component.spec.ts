import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { BudgetsListComponent } from './budgets-list.component';
import { BudgetService, BudgetDTO } from '../../../core/services/budget.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class MockBudgetService {
  listSubject = new Subject<BudgetDTO[]>();
  removeSubject = new Subject<any>();

  listCalls: any[] = [];
  removeCalls: any[] = [];

  list = (q: any) => {
    this.listCalls.push(q);
    return this.listSubject.asObservable();
  };
  remove = (id: string) => {
    this.removeCalls.push(id);
    return this.removeSubject.asObservable();
  };
}

const makeBudget = (over: Partial<BudgetDTO> = {}): BudgetDTO => ({
  _id: over._id ?? 'id-1',
  month: over.month ?? '2025-10',
  monthStart:
    over.monthStart ??
    '2025-10-01T00:00:00.000Z', // change to new Date(...) if your DTO uses Date
  category: over.category ?? 'Groceries',
  amount: over.amount ?? 0,
  description: over.description ?? '',
});

describe('BudgetsListComponent (standalone)', () => {
  let fixture: ComponentFixture<BudgetsListComponent>;
  let comp: BudgetsListComponent;
  let api: MockBudgetService;
  let snack: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    snack = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [BudgetsListComponent],
      providers: [{ provide: BudgetService, useClass: MockBudgetService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // allow <app-budgets> tag
    })
      // ✅ ensure our spy is injected instead of the module provider
      .overrideProvider(MatSnackBar, { useValue: snack })
      .compileComponents();

    fixture = TestBed.createComponent(BudgetsListComponent);
    comp = fixture.componentInstance;
    api = TestBed.inject(BudgetService) as any;
    fixture.detectChanges(); // ngOnInit -> fetch()
  });

  it('fetches and displays rows; sets loading flags', () => {
    expect(api.listCalls.length).toBe(1);
    expect(comp.loading).toBeTrue();

    const rows: BudgetDTO[] = [
      makeBudget({ _id: '1', amount: 1200, description: 'wk1' }),
      makeBudget({ _id: '2', category: 'Rent', amount: 15000, description: '' }),
    ];
    api.listSubject.next(rows);
    api.listSubject.complete();
    fixture.detectChanges();

    expect(comp.loading).toBeFalse();
    expect(comp.rows.length).toBe(2);
    expect(comp.total).toBe(2);
  });

  it('clearFilters resets filters and refetches', () => {
    comp.month = '2025-09';
    comp.category = 'Utilities';

    const fetchSpy = spyOn(comp, 'fetch').and.callThrough();
    comp.clearFilters();

    expect(comp.month).toBe('');
    expect(comp.category).toBe('');
    expect(comp.skip).toBe(0);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('openForm & onFormClosed toggle modal and refetch after close', () => {
    const fetchSpy = spyOn(comp, 'fetch').and.callThrough();

    comp.openForm();
    expect(comp.showForm).toBeTrue();

    comp.onFormClosed();
    expect(comp.showForm).toBeFalse();
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('delete calls remove after confirm=true, shows success toast, and refetches', () => {
    const row: BudgetDTO = makeBudget({ _id: 'abc', category: 'Transport', amount: 900 });
    spyOn(window, 'confirm').and.returnValue(true);

    const fetchSpy = spyOn(comp, 'fetch').and.callThrough();

    comp.delete(row);
    expect(api.removeCalls).toEqual(['abc']);

    api.removeSubject.next({});
    api.removeSubject.complete();
    fixture.detectChanges();

    expect(snack.open).toHaveBeenCalledWith('Budget deleted', 'Close', jasmine.any(Object));
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('delete does nothing if confirm=false', () => {
    const row: BudgetDTO = makeBudget({ _id: 'nope', category: 'Other', amount: 1 });
    spyOn(window, 'confirm').and.returnValue(false);

    comp.delete(row);
    expect(api.removeCalls.length).toBe(0);
  });
});
