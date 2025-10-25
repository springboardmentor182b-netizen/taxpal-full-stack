import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  Dashboard } from './dashboard.component'; // ✅ standalone Dashboard

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard] // ✅ using Dashboard directly
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default financial values', () => {
    expect(component.monthlyIncome).toBe(420.0);
    expect(component.monthlyExpenses).toBe(0.0);
    expect(component.estimatedTax).toBe(0.0);
    expect(component.savingsRate).toBe(100.0);
  });

  it('should toggle sidebar state', () => {
    expect(component.sidebarActive).toBeFalse();
    component.toggleSidebar();
    expect(component.sidebarActive).toBeTrue();
  });

  it('should render top cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.top-cards .card');
    expect(cards.length).toBe(4); // Monthly income, expenses, tax due, savings
  });

  it('should render recent transactions table', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('.tx-table');
    expect(table).toBeTruthy();
    expect(table?.querySelectorAll('tbody tr').length).toBeGreaterThan(0);
  });
});
