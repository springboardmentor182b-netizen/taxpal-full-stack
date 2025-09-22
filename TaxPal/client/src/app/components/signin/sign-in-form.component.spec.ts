/// <reference types="jasmine" />
// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { SignInFormComponent } from './sign-in-form.component';

describe('SignInFormComponent (UI)', () => {
    let fixture: ComponentFixture<SignInFormComponent>;
    let component: SignInFormComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, FormsModule, SignInFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SignInFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render email and password inputs and a Sign in button', () => {
        const emailInput = fixture.debugElement.query(By.css('input#email'));
        const passwordInput = fixture.debugElement.query(By.css('input#password'));
        const signInButton = fixture.debugElement.query(By.css('button.sign-in-btn'));

        expect(emailInput).toBeTruthy();
        expect(passwordInput).toBeTruthy();
        expect(signInButton).toBeTruthy();
        expect(signInButton.nativeElement.textContent).toContain('Sign in');
    });

    it('should toggle password visibility when toggle button is clicked', () => {
        const getPasswordInputType = () => fixture.debugElement.query(By.css('#password')).nativeElement.type;
        const toggleButton = fixture.debugElement.query(By.css('.toggle-password'));

        expect(getPasswordInputType()).toBe('password');

        toggleButton.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(getPasswordInputType()).toBe('text');

        toggleButton.triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(getPasswordInputType()).toBe('password');
    });
});


