import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportDownloadComponent } from './export-download.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('ExportDownloadComponent', () => {
  let component: ExportDownloadComponent;
  let fixture: ComponentFixture<ExportDownloadComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportDownloadComponent],
      imports: [HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportDownloadComponent);
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

  // Test Case 1: Report Preview Generation Test
  it('should generate report preview successfully and display data', () => {
    const mockResponse = {
      data: {
        reports: [
          { name: 'January', income: 5000, expenses: 3000, netIncome: 2000 },
          { name: 'February', income: 4500, expenses: 2500, netIncome: 2000 }
        ],
        yearSummary: { totalIncome: 9500, totalExpenses: 5500, netSavings: 4000 },
        year: 2024
      }
    };

    component.showReportPreview();

    const req = httpMock.expectOne('/api/reports/preview-report');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(component.previewData).toEqual(mockResponse.data);
    expect(component.showPreview).toBe(true);
    expect(component.previewLoading).toBe(false);
  });

  // Test Case 2: Report Download Test
  it('should download report in selected format successfully', () => {
    const mockBlob = new Blob(['test,csv,data'], { type: 'text/csv' });
    component.selectedFormat = 'csv';
    component.selectedReport = 'Financial Summary';
    component.selectedPeriod = '2024';

    // Mock preview data
    component.previewData = {
      reports: [{ name: 'January', income: 5000, expenses: 3000 }],
      yearSummary: { totalIncome: 5000, totalExpenses: 3000, netSavings: 2000 },
      year: 2024
    };

    spyOn(window.URL, 'createObjectURL').and.returnValue('mock-url');
    spyOn(window.URL, 'revokeObjectURL');
    const createElementSpy = spyOn(document, 'createElement').and.callThrough();
    const clickSpy = jasmine.createSpy('click');

    createElementSpy.and.returnValue({ href: '', download: '', click: clickSpy } as any);

    component.downloadFromPreview();

    const req = httpMock.expectOne('/api/reports/generate-report');
    expect(req.request.method).toBe('POST');
    req.flush(mockBlob);

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });
});
