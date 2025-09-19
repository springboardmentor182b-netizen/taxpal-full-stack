
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
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Subscribe to loading state
    this.authService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);

    // Check for success message from signup
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['message']) {
          this.successMessage = decodeURIComponent(params['message']);
          // Clear the query parameter
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.clearMessages();
    
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched();
    
    // Debug: Log form status (remove in production)
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form values:', { ...this.loginForm.value, password: '[HIDDEN]' });
    
    if (this.loginForm.valid) {
      // Extract form data - Choose the format your backend expects
      
      // Option 1: If backend expects 'email' field
      const loginData = {
        email: this.loginForm.value.email.trim(),
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe || false
      };

      // Option 2: If backend expects 'username' field (uncomment this and comment above)
      // const loginData = {
      //   username: this.loginForm.value.email.trim(), // Send email as username
      //   password: this.loginForm.value.password,
      //   rememberMe: this.loginForm.value.rememberMe || false
      // };
      
      this.authService.login(loginData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user) => {
            console.log('Login successful:', user);
            this.successMessage = `Welcome back, ${user.fullName}!`;
            
            // Navigate to dashboard after short delay
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1000);
          },
          error: (error) => {
            console.error('Login error:', error);
            this.handleLoginError(error);
          }
        });
    } else {
      // Show specific validation errors
      const invalidFields = this.getInvalidFields();
      if (invalidFields.length > 0) {
        this.errorMessage = `Please correct the following: ${invalidFields.join(', ')}`;
      } else {
        this.errorMessage = 'Please fill in all required fields correctly.';
      }
      this.scrollToFirstError();
    }
  }

  private handleLoginError(error: any): void {
    this.successMessage = '';
    
    // Handle specific error cases
    if (error.status === 401) {
      this.errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.status === 404) {
      this.errorMessage = 'Account not found. Please check your email or sign up.';
    } else if (error.status === 429) {
      this.errorMessage = 'Too many login attempts. Please try again later.';
    } else if (error.status === 0) {
      this.errorMessage = 'Unable to connect to server. Please check your internet connection and ensure the backend server is running.';
    } else if (error.status >= 500) {
      this.errorMessage = 'Server error. Please try again later.';
    } else {
      this.errorMessage = error.message || 'Login failed. Please try again.';
    }
  }

  private getInvalidFields(): string[] {
    const invalidFields: string[] = [];
    
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control && control.invalid) {
        invalidFields.push(this.getFieldLabel(key));
      }
    });
    
    return invalidFields;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      const errors = field.errors;
      
      if (errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (errors?.['minlength']) {
        const requiredLength = errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (errors?.['maxlength']) {
        const maxLength = errors['maxlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
      }
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'email': 'Email',
      'password': 'Password',
      'rememberMe': 'Remember me'
    };
    return labels[fieldName] || this.capitalizeFirst(fieldName);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
      control?.markAsDirty();
    });
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private scrollToFirstError(): void {
    setTimeout(() => {
      const firstError = document.querySelector('.form-field__error, .error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToSignup(): void {
    console.log('Navigating to signup...');
    this.router.navigate(['/features/signup']).then(
      (success) => {
        console.log('Navigation success:', success);
      },
      (error) => {
        console.error('Navigation error:', error);
      }
    );
  }

  forgotPassword(): void {
    // Navigate to forgot password page
    this.router.navigate(['/features/forgot-password']);
  }

  // Utility methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFormControl(fieldName: string) {
    return this.loginForm.get(fieldName);
  }

  // Test connection method (remove in production)
  testConnection(): void {
    console.log('Testing API connection...');
    this.authService.testConnection().subscribe({
      next: (response) => {
        console.log('✅ API connection successful:', response);
        this.successMessage = 'Backend server is running and accessible!';
      },
      error: (error) => {
        console.error('❌ API connection failed:', error);
        this.errorMessage = `API connection failed: ${error.message}`;
      }
    });
  }
}