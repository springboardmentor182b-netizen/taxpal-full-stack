// src/app/features/financialReport/financialReport.spec.ts
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { FinancialReportsComponent } from './financialReport';
import {
  FinancialReportService,
  FinancialReport,
} from '../../../core/services/financialReport.service';

describe('FinancialReportsComponent', () => {
  let fixture: ComponentFixture<FinancialReportsComponent>;
  let component: FinancialReportsComponent;
  let service: FinancialReportService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ Standalone component goes in imports, not declarations
      imports: [FinancialReportsComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [FinancialReportService],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialReportsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FinancialReportService);
    router = TestBed.inject(Router);

    // default stub to keep init quiet
    spyOn(service, 'listReports').and.returnValue(of([]));
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load recent reports on init', () => {
    const mock: FinancialReport[] = [
      {
        _id: '1',
        name: 'Income Statement — Last Month',
        reportType: 'income-statement',
        period: 'last-month',
        periodLabel: 'Last Month',
        format: 'pdf',
        createdAt: new Date().toISOString(),
      },
    ];
    (service.listReports as jasmine.Spy).and.returnValue(of(mock));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.recent.length).toBe(1);
    expect(component.loadingList).toBeFalse();
  });

  it('should generate report and navigate to export', fakeAsync(() => {
    const navSpy = spyOn(router, 'navigate');
    spyOn(service, 'createReport').and.returnValue(
      of({
        _id: 'abc123',
        reportType: 'income-statement',
        period: 'current-month',
        periodLabel: 'Current Month',
        format: 'pdf',
      } as FinancialReport),
    );

    component.reportType = 'income-statement';
    component.period = 'current-month';
    component.format = 'pdf';

    component.generateReport();
    tick();

    expect(component.generating).toBeFalse();
    expect(navSpy).toHaveBeenCalledWith(['/export'], {
      queryParams: {
        id: 'abc123',
        type: 'income-statement',
        period: 'current-month',
        format: 'pdf',
      },
    });
  }));

  it('should handle generation error', fakeAsync(() => {
    spyOn(service, 'createReport').and.returnValue(
      throwError(() => ({ error: { message: 'Failed' } })),
    );

    component.generateReport();
    tick();

    expect(component.generating).toBeFalse();
    expect(component.errorMsg).toContain('Failed');
  }));

  it('should delete a report after confirmation and refresh list', fakeAsync(() => {
    const report: FinancialReport = {
      _id: 'del-1',
      name: 'To Delete',
      reportType: 'income-statement',
      period: 'current-month',
      periodLabel: 'Current Month',
      format: 'pdf',
    };
    component.recent = [report];

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(service, 'deleteReport').and.returnValue(of({} as any));
    (service.listReports as jasmine.Spy).and.returnValues(of([])); // refresh call

    component.deleteReport(report);
    tick();

    expect(service.deleteReport).toHaveBeenCalledWith('del-1');
  }));

  it('should reset form to defaults', () => {
    component.reportType = 'balance-sheet';
    component.period = 'this-year';
    component.format = 'xlsx';

    component.resetForm();

    expect(component.reportType).toBe('income-statement');
    expect(component.period).toBe('current-month');
    expect(component.format).toBe('pdf');
  });
});
