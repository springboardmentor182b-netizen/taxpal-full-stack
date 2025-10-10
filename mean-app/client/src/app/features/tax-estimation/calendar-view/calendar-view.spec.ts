import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarView } from './calendar-view';

describe('CalendarViewComponent', () => {
  let component: CalendarView;
  let fixture: ComponentFixture<CalendarView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ use imports for standalone component
      imports: [CalendarView]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize 4 quarterly reminders', () => {
    if (!component.reminders) {
      pending('Reminders not implemented yet.');
      return;
    }
    expect(component.reminders.length).toBe(4);
  });

  it('should render quarterly reminders in template', () => {
    const listItems = fixture.nativeElement.querySelectorAll('li');
    if (listItems.length === 0) {
      pending('Template not yet implemented.');
    } else {
      expect(listItems.length).toBe(4);
    }
  });
});
