/// <reference types="jasmine" />
// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { SignUpFormComponent } from './sign-up-form.component';

describe('SignUpFormComponent (UI)', () => {
    let fixture: ComponentFixture<SignUpFormComponent>;
    let component: SignUpFormComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, FormsModule, SignUpFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SignUpFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render required fields and disabled Create Account button initially', () => {
        const firstName = fixture.debugElement.query(By.css('#firstName'));
        const lastName = fixture.debugElement.query(By.css('#lastName'));
        const email = fixture.debugElement.query(By.css('#email'));
        const password = fixture.debugElement.query(By.css('#password'));
        const country = fixture.debugElement.query(By.css('#country'));
        const agree = fixture.debugElement.query(By.css('input[type="checkbox"]'));
        const createBtn = fixture.debugElement.query(By.css('button.sign-up-btn'));

        expect(firstName).toBeTruthy();
        expect(lastName).toBeTruthy();
        expect(email).toBeTruthy();
        expect(password).toBeTruthy();
        expect(country).toBeTruthy();
        expect(agree).toBeTruthy();
        expect(createBtn.properties['disabled']).toBeTrue();
    });

    it('should enable Create Account button when form becomes valid', () => {
        component.firstName = 'John';
        component.lastName = 'Doe';
        component.email = 'john@doe.com';
        component.password = 'Secret123!';
        component.country = 'us';
        component.agreeToTerms = true;
        fixture.detectChanges();

        const createBtn = fixture.debugElement.query(By.css('button.sign-up-btn'));
        expect(component.isFormValid()).toBeTrue();
        expect(createBtn.properties['disabled']).toBeFalse();
    });
});


