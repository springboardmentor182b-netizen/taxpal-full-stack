import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeForm } from './income-form';

describe('IncomeForm', () => {
  let component: IncomeForm;
  let fixture: ComponentFixture<IncomeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
