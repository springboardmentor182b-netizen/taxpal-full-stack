import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsCategories } from './settings.categories';

describe('SettingsCategories', () => {
  let component: SettingsCategories;
  let fixture: ComponentFixture<SettingsCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
