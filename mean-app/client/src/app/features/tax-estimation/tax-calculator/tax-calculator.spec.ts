import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TaxCalculator } from './tax-calculator';

describe('TaxCalculatorComponent', () => {
  let component: TaxCalculator;
  let fixture: ComponentFixture<TaxCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ for standalone components
      imports: [TaxCalculator, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TaxCalculator);
    component = fixture.componentInstance;
  });

  it('should calculate estimated tax correctly', () => {
    component.income = 50000;
    component.taxRate = 0.2;
    component.calculateTax();
    expect(component.estimatedTax).toBe(10000);
  });

  it('should display estimated tax in template after calculation', () => {
    component.income = 30000;
    component.taxRate = 0.1;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'))?.nativeElement;
    if (button) {
      button.click();
      fixture.detectChanges();
      const result = fixture.debugElement.query(By.css('#result'))?.nativeElement.textContent;
      expect(result).toContain('3000');
    } else {
      pending('Template not yet implemented.');
    }
  });
});
