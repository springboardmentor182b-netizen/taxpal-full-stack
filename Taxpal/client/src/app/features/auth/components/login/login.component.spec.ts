import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { DebugElement } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title "TaxPal"', () => {
    const title = el.query(By.css('.login-title')).nativeElement;
    expect(title.textContent).toContain('TaxPal');
  });

  it('form should be invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let email = component.loginForm.controls['email'];
    expect(email.valid).toBeFalsy();

    // Required error
    let errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set email to something incorrect
    email.setValue('abc');
    errors = email.errors || {};
    expect(errors['email']).toBeTruthy();

    // Set email to correct format
    email.setValue('abc@test.com');
    errors = email.errors || {};
    expect(errors['email']).toBeFalsy();
  });

  it('password field validity', () => {
    let password = component.loginForm.controls['password'];
    expect(password.valid).toBeFalsy();

    // Required error
    let errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set value
    password.setValue('12345');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('form should be valid when all fields are filled correctly', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should disable the button if form is invalid', () => {
    const button = el.query(By.css('button[type=submit]')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should enable the button if form is valid', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    fixture.detectChanges();

    const button = el.query(By.css('button[type=submit]')).nativeElement;
    expect(button.disabled).toBeFalsy();
  });

  it('should call onSubmit when form is submitted', () => {
    spyOn(component, 'onSubmit');
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');

    const form = el.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(component.onSubmit).toHaveBeenCalled();
  });
});
