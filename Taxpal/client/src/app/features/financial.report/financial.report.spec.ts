import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { FinancialReportsComponent } from './financial.report';
import { FinancialReportsService } from '../../core/services/financial.report.service';

describe('FinancialReportsComponent', () => {
  let component: FinancialReportsComponent;
  let fixture: ComponentFixture<FinancialReportsComponent>;
  let service: FinancialReportsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialReportsComponent],
      imports: [HttpClientTestingModule],
      providers: [FinancialReportsService]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialReportsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FinancialReportsService);
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load reports on init', fakeAsync(() => {
    spyOn(service, 'getRecentReports').and.returnValue(of([{
      id: '1',
      name: 'Test Report',
      reportType: 'INCOME_STATEMENT',
      period: 'CURRENT_MONTH',
      format: 'PDF',
      fileSize: '1.5 MB',
      status: 'COMPLETED',
      generatedDate: new Date()
    }]));
    
    component.ngOnInit();
    tick();
    
    expect(component.recentReports.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  }));

  it('should generate report successfully', fakeAsync(() => {
    spyOn(service, 'generateReport').and.returnValue(of({
      id: '1',
      name: 'Generated Report',
      reportType: 'INCOME_STATEMENT',
      period: 'CURRENT_MONTH',
      format: 'PDF',
      fileSize: '1.5 MB',
      status: 'COMPLETED',
      generatedDate: new Date()
    }));
    
    component.generateReport();
    tick(3000);
    
    expect(component.isGenerating).toBeFalse();
    expect(component.recentReports.length).toBe(1);
  }));

  it('should handle generation error', fakeAsync(() => {
    spyOn(service, 'generateReport').and.returnValue(throwError(() => new Error('Failed')));
    
    component.generateReport();
    tick();
    
    expect(component.isGenerating).toBeFalse();
    expect(component.errorMessage).toContain('Failed');
  }));

  it('should download report', () => {
    spyOn(service, 'downloadReport').and.returnValue(of({
      blob: new Blob(['test']),
      contentType: 'application/pdf'
    }));
    
    component.downloadReport('1');
    
    expect(service.downloadReport).toHaveBeenCalledWith('1');
  });

  it('should delete report', fakeAsync(() => {
    component.recentReports = [{
      id: '1',
      name: 'Test Report',
      reportType: 'INCOME_STATEMENT',
      period: 'CURRENT_MONTH',
      format: 'PDF',
      fileSize: '1.5 MB',
      status: 'COMPLETED',
      generatedDate: new Date()
    }];
    
    spyOn(service, 'deleteReport').and.returnValue(of(undefined));
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.deleteReport('1');
    tick();
    
    expect(service.deleteReport).toHaveBeenCalledWith('1');
  }));

  it('should reset form', () => {
    component.reportRequest = {
      reportType: 'BALANCE_SHEET',
      period: 'LAST_YEAR',
      format: 'EXCEL'
    };
    
    component.resetForm();
    
    expect(component.reportRequest.reportType).toBe('INCOME_STATEMENT');
    expect(component.reportRequest.period).toBe('CURRENT_MONTH');
  });
});