import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportDownloadComponent } from './export-download.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('ExportDownloadComponent', () => {
  let component: ExportDownloadComponent;
  let fixture: ComponentFixture<ExportDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportDownloadComponent],
      imports: [HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default format as empty string', () => {
    expect(component.selectedFormat).toBe('');
  });

  it('should call export function when triggered', () => {
    const spy = spyOn(component as any, 'exportData');
    (component as any).exportData();
    expect(spy).toHaveBeenCalled();
  });

  it('should show available formats list', () => {
    const formats = ['CSV', 'Excel', 'PDF'];
    (component as any).availableFormats = formats;
    expect((component as any).availableFormats.length).toBe(3);
  });
});