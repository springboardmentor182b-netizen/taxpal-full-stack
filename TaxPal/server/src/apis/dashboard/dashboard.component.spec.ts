import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, CommonModule, NavbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the DashboardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have isDarkMode true when document has "dark" class', () => {
    document.documentElement.classList.add('dark');
    const comp = new DashboardComponent();
    expect(comp.isDarkMode).toBeTrue();
    document.documentElement.classList.remove('dark');
  });

  it('should have isDarkMode false when document does not have "dark" class', () => {
    document.documentElement.classList.remove('dark');
    const comp = new DashboardComponent();
    expect(comp.isDarkMode).toBeFalse();
  });
});
