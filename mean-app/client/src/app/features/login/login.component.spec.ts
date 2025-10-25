import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService, LoginRequest, LoginResponse } from '../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated'], {
      isLoading$: of(false)
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpyObj = {
      snapshot: {
        queryParams: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    fixture.detectChanges();
  });

  // TEST CASE 1: Valid Login Test - Verify successful login with correct credentials
  it('should successfully login with valid credentials and redirect to dashboard', fakeAsync(() => {
    // Arrange
    const mockLoginRequest: LoginRequest = {
      email: 'john@example.com',
      password: 'ValidPass123'
    };

    const mockLoginResponse: LoginResponse = {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe'
      },
      message: 'Login successful'
    };
    
    authServiceSpy.login.and.returnValue(of(mockLoginResponse));
    spyOn(localStorage, 'setItem');
    spyOn(sessionStorage, 'setItem');

    // Set valid form values
    component.loginForm.patchValue({
      email: 'john@example.com',
      password: 'ValidPass123',
      rememberMe: true
    });

    // Act
    component.onSubmit();

    // Assert
    expect(authServiceSpy.login).toHaveBeenCalledWith(mockLoginRequest);
    expect(component.successMessage).toBe('Welcome back, John Doe!');
    expect(component.errorMessage).toBe('');
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
    
    // Fast forward time to trigger navigation
    tick(1000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  // TEST CASE 2: Invalid Login Test - Verify error handling with incorrect credentials
  it('should handle login failure and display appropriate error message', () => {
    // Arrange
    const mockError = {
      status: 401,
      message: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS'
    };
    
    authServiceSpy.login.and.returnValue(throwError(() => mockError));

    // Set form values (invalid credentials)
    component.loginForm.patchValue({
      email: 'wrong@example.com',
      password: 'wrongpassword',
      rememberMe: false
    });

    // Act
    component.onSubmit();

    // Assert
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'wrong@example.com',
      password: 'wrongpassword'
    });
    
    expect(component.errorMessage).toBe('Invalid email or password. Please try again.');
    expect(component.successMessage).toBe('');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});