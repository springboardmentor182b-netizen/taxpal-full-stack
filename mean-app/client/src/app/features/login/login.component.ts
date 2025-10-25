import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  rememberMe: boolean = false;
  private destroy$ = new Subject<void>();
  
  // For redirect after login
  private returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],   // ✅ email instead of username
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
      return;
    }
  
    const message = this.route.snapshot.queryParams['message'];
    if (message) {
      this.successMessage = decodeURIComponent(message);
    }
  
    // Subscribe to loading state
    this.authService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);
  }
  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.clearMessages();
      const credentials = {
        email: this.loginForm.get('email')?.value.trim(),   // ✅ fixed
        password: this.loginForm.get('password')?.value
      };
      
      this.authService.login(credentials)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            console.log('Login successful:', res);
            this.successMessage = `Welcome back, ${res.user.fullName}!`;

            // ✅ store token based on rememberMe
            if (this.loginForm.get('rememberMe')?.value) {
              localStorage.setItem('token', res.token);
            } else {
              sessionStorage.setItem('token', res.token);
            }

            // Small delay to show success message before redirecting
            setTimeout(() => {
              this.router.navigate([this.returnUrl]);
            }, 1000);
          },
          error: (error) => {
            console.error('Login error:', error);
            this.handleLoginError(error);
          }
        });
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  private handleLoginError(error: any): void {
    // Clear any existing success messages
    this.successMessage = '';
    
    // Handle different types of errors
    if (error.status === 401) {
      this.errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.status === 403) {
      this.errorMessage = 'Account is locked or not verified. Please contact support.';
    } else if (error.status === 429) {
      this.errorMessage = 'Too many login attempts. Please try again in a few minutes.';
    } else if (error.status === 0) {
      this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
    } else {
      this.errorMessage = error.message || 'Login failed. Please try again.';
    }
  }
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors?.['minlength']) {
        const requiredLength = field.errors?.['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'email': 'Email',
      'password': 'Password'
    };
    return labels[fieldName] || this.capitalizeFirst(fieldName);
  }
  
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToSignup(): void {
    const queryParams = this.returnUrl !== '/dashboard' ? { returnUrl: this.returnUrl } : {};
    this.router.navigate(['/signup'], { queryParams });
  }
  
  navigateToForgotPassword(): void {
    console.log('Navigating to forgot password...');
    this.router.navigate(['/forgot-password']);
  }
  

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  } 
  getFormControl(fieldName: string) {
    return this.loginForm.get(fieldName);
  }
}
