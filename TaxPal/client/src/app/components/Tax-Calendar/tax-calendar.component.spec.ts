import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TaxCalendarComponent } from './tax-calendar.component';

describe('TaxCalendarComponent', () => {
  let component: TaxCalendarComponent;
  let fixture: ComponentFixture<TaxCalendarComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TaxCalendarComponent],
      providers: [
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaxCalendarComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentDate).toBeDefined();
    expect(component.selectedDate).toBeNull();
    expect(component.currentMonth).toBeDefined();
    expect(component.taxEvents).toBeDefined();
    expect(component.taxEvents.length).toBeGreaterThan(0);
  });

  it('should toggle dark mode', () => {
    const initialMode = component.isDarkMode;
    component.toggleDarkMode();
    expect(component.isDarkMode).toBe(!initialMode);
  });

  it('should navigate to tax estimator', () => {
    component.navigateToEstimator();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tax-estimator']);
  });

  it('should get days in month', () => {
    const date = new Date(2023, 0, 1); // January 2023
    const days = component.getDaysInMonth(date);
    expect(days.length).toBeGreaterThan(28); // At least 28 days in January
    expect(days[0].getDay()).toBe(0); // Should start on Sunday
  });

  it('should get events for date', () => {
    const testDate = new Date(2025, 3, 15); // April 15, 2025
    const events = component.getEventsForDate(testDate);
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].title).toContain('Tax Return Filing Deadline');
  });

  it('should check if date is today', () => {
    const today = new Date();
    expect(component.isToday(today)).toBe(true);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    expect(component.isToday(tomorrow)).toBe(false);
  });

  it('should check if date is in current month', () => {
    const currentMonthDate = new Date();
    expect(component.isCurrentMonth(currentMonthDate)).toBe(true);
    const nextMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1);
    expect(component.isCurrentMonth(nextMonth)).toBe(false);
  });

  it('should navigate to previous month', () => {
    const initialMonth = component.currentMonth.getMonth();
    component.previousMonth();
    expect(component.currentMonth.getMonth()).toBe((initialMonth - 1 + 12) % 12);
  });

  it('should navigate to next month', () => {
    const initialMonth = component.currentMonth.getMonth();
    component.nextMonth();
    expect(component.currentMonth.getMonth()).toBe((initialMonth + 1) % 12);
  });

  it('should select date', () => {
    const testDate = new Date();
    component.selectDate(testDate);
    expect(component.selectedDate).toBe(testDate);
  });

  it('should get month name', () => {
    const monthName = component.getMonthName();
    expect(monthName).toMatch(/^\w+ \d{4}$/); // Format: "Month Year"
  });

  it('should estimate tax', () => {
    component.estimateTax();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tax-estimator']);
  });

  it('should check if date has event type', () => {
    const testDate = new Date(2025, 3, 15); // April 15, 2025
    expect(component.hasEventType(testDate, 'deadline')).toBe(true);
    expect(component.hasEventType(testDate, 'reminder')).toBe(false);
  });

  it('should check if date has event priority', () => {
    const testDate = new Date(2025, 3, 15); // April 15, 2025
    expect(component.hasEventPriority(testDate, 'high')).toBe(true);
    expect(component.hasEventPriority(testDate, 'low')).toBe(false);
  });

  it('should toggle theme', () => {
    const initialMode = component.isDarkMode;
    component.toggleTheme();
    expect(component.isDarkMode).toBe(!initialMode);
  });

  it('should load tax events', () => {
    component.loadTaxEvents();
    expect(component.taxEvents.length).toBeGreaterThan(0);
    expect(component.taxEvents[0].title).toBeDefined();
    expect(component.taxEvents[0].date).toBeDefined();
    expect(component.taxEvents[0].type).toBeDefined();
    expect(component.taxEvents[0].priority).toBeDefined();
  });
});
