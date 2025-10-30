import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ReportsService } from '../../../services/reports.service';
import { AuthService } from '../../../features/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';


describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let mockReportsService: jasmine.SpyObj<ReportsService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockReportsService = jasmine.createSpyObj('ReportsService', [
      'getReports',
      'generateReport',
      'downloadReport'
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        ReportsComponent 
      ],
      providers: [
        { provide: ReportsService, useValue: mockReportsService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
  });

  
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  
  it('should load current user and fetch reports', () => {
    const user = { id: '1', fullName: 'Pavithra Y', email: 'pav@example.com', username: 'pavi' };
    mockAuthService.getCurrentUser.and.returnValue(user);
    mockReportsService.getReports.and.returnValue(of([]));

    component.loadCurrentUser();

    expect(component.currentUser).toEqual(user);
    expect(mockReportsService.getReports).toHaveBeenCalledWith('1');
  });

  
  it('should navigate to login if user not logged in', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);

    component.loadCurrentUser();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  
  it('should handle fetchReports error', () => {
    mockReportsService.getReports.and.returnValue(throwError(() => new Error('Server Error')));
    component.currentUser.id = '1';
    component.fetchReports();
    expect(component.recentReports).toEqual([]);
  });

  
  it('should generate report successfully', () => {
    component.currentUser.id = '1';
    component.newReport.set({
      reportType: 'Expense Report',
      reportPeriod: 'Current Month',
      format: 'PDF'
    });

    const mockResponse = {
      success: true,
      data: {
        _id: '123',
        reportType: 'Expense Report',
        period: 'Current Month',
        format: 'PDF'
      }
    };

    mockReportsService.generateReport.and.returnValue(of(mockResponse));
    component.generateReport();
    expect(mockReportsService.generateReport).toHaveBeenCalled();
    expect(component.recentReports.length).toBeGreaterThan(0);
  });


  it('should handle error during report generation', () => {
    component.currentUser.id = '1';
    component.newReport.set({
      reportType: 'Expense Report',
      reportPeriod: 'Current Month',
      format: 'PDF'
    });

    mockReportsService.generateReport.and.returnValue(throwError(() => new Error('Server Error')));
    spyOn(console, 'error');

    component.generateReport();
    expect(console.error).toHaveBeenCalledWith('Error generating report:', jasmine.any(Error));
  });


  it('should download report successfully', () => {
    const blob = new Blob(['sample'], { type: 'application/pdf' });
    mockReportsService.downloadReport.and.returnValue(of(blob));

    const report = { 
      _id: '1', 
      reportType: 'Expense Report', 
      period: 'Current Month', 
      format: 'PDF' 
    };

    spyOn(document, 'createElement').and.callThrough();
    component.downloadReport(report);

    expect(mockReportsService.downloadReport).toHaveBeenCalledWith('1', 'PDF');
  });

  
  it('should not download report if id or format missing', () => {
    const report = { reportType: 'Expense Report' } as any;
    component.downloadReport(report);
    expect(mockReportsService.downloadReport).not.toHaveBeenCalled();
  });


  it('should reset form', () => {
    component.newReport.set({
      reportType: 'Tax Summary',
      reportPeriod: 'Last Month',
      format: 'Excel'
    });
    component.resetForm();
    expect(component.newReport().reportType).toBeNull();
  });

  it('should update report fields correctly', () => {
    component.updateNewReportType('Income Statement');
    expect(component.newReport().reportType).toBe('Income Statement');

    component.updateNewReportPeriod('Last Year');
    expect(component.newReport().reportPeriod).toBe('Last Year');

    component.updateNewReportFormat('CSV');
    expect(component.newReport().format).toBe('CSV');
  });
});