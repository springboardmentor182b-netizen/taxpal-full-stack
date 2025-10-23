import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportComponent } from './component/export.component';


describe('Export', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
