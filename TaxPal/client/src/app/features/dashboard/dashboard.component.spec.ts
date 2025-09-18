import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeAll(() => {
    // Mock Chart.js so it won't break tests
    (window as any).Chart = class {
      destroy() {}
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent]   // ✅ standalone component
    }).compileComponents();
  });

  it('should create the dashboard component', () => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should toggle light-mode class when modeToggle is clicked', () => {
    // Create button BEFORE component is instantiated
    const button = document.createElement('button');
    button.id = 'modeToggle';
    const icon = document.createElement('i');
    button.appendChild(icon);
    document.body.appendChild(button);

    // Now create component (ngAfterViewInit sees the button)
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Click once → add light-mode
    button.click();
    expect(document.body.classList.contains('light-mode')).toBeTrue();

    // Click again → remove light-mode
    button.click();
    expect(document.body.classList.contains('light-mode')).toBeFalse();

    // Cleanup
    document.body.removeChild(button);
  });
});
