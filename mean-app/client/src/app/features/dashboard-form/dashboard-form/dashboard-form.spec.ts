import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardForm } from './dashboard-form';

describe('DashboardForm', () => {
  let component: DashboardForm;
  let fixture: ComponentFixture<DashboardForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
