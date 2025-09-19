import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  private destroy$ = new Subject<void>();

  countries = [
    { value: 'us', label: 'United States' },
    { value: 'in', label: 'India' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'sg', label: 'Singapore' },
    { value: 'br', label: 'Brazil' },
    { value: 'mx', label: 'Mexico' },
    { value: 'it', label: 'Italy' },
    { value: 'es', label: 'Spain' },
    { value: 'nl', label: 'Netherlands' },
    { value: 'se', label: 'Sweden' },
    { value: 'no', label: 'Norway' },
    { value: 'dk', label: 'Denmark' },
    { value: 'fi', label: 'Finland' },
    { value: 'ch', label: 'Switzerland' },
    { value: 'at', label: 'Austria' },
    { value: 'be', label: 'Belgium' },
    { value: 'ie', label: 'Ireland' },
    { value: 'nz', label: 'New Zealand' },
    { value: 'za', label: 'South Africa' },
    { value: 'kr', label: 'South Korea' },
    { value: 'cn', label: 'China' },
    { value: 'hk', label: 'Hong Kong' },
    { value: 'tw', label: 'Taiwan' },
    { value: 'th', label: 'Thailand' },
    { value: 'my', label: 'Malaysia' },
    { value: 'id', label: 'Indonesia' },
    { value: 'ph', label: 'Philippines' },
    { value: 'vn', label: 'Vietnam' },
    { value: 'ae', label: 'United Arab Emirates' },
    { value: 'sa', label: 'Saudi Arabia' },
    { value: 'il', label: 'Israel' },
    { value: 'tr', label: 'Turkey' },
    { value: 'ru', label: 'Russia' },
    { value: 'pl', label: 'Poland' },
    { value: 'cz', label: 'Czech Republic' },
    { value: 'hu', label: 'Hungary' },
    { value: 'ro', label: 'Romania' },
    { value: 'bg', label: 'Bulgaria' },
    { value: 'hr', label: 'Croatia' },
    { value: 'si', label: 'Slovenia' },
    { value: 'sk', label: 'Slovakia' },
    { value: 'lt', label: 'Lithuania' },
    { value: 'lv', label: 'Latvia' },
    { value: 'ee', label: 'Estonia' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Form definition WITHOUT termsAccepted field
    this.signupForm = this.fb.group({
      fullName: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50),
        this.nameValidator
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(100)
      ]],
      username: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(20),
        this.usernameValidator
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6), // Changed from 8 to 6 to match backend
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', [Validators.required]],
      country: ['', [Validators.required]]
    }, { 
      validators: [this.passwordMatchValidator] 
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

    // Set default country to India
    this.signupForm.patchValue({ country: 'in' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.clearMessages();
    
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched();
    
    console.log('Form valid:', this.signupForm.valid);
    console.log('Form values:', { ...this.signupForm.value, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });
    
    if (this.signupForm.valid) {
      // Extract form data and remove confirmPassword
      const formData = { ...this.signupForm.value };
      const { confirmPassword, ...userData } = formData;
      
      // Trim string fields
      Object.keys(userData).forEach(key => {
        if (typeof userData[key] === 'string') {
          userData[key] = userData[key].trim();
        }
      });
      
      console.log('Sending signup data:', { ...userData, password: '[HIDDEN]' });
      
      this.authService.signup(userData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user) => {
            console.log('Signup successful:', user);
            this.successMessage = `Welcome ${user.fullName}! Your account has been created successfully.`;
            
            // Navigate to login with success message
            setTimeout(() => {
              this.router.navigate(['/features/login'], {
                queryParams: { 
                  message: encodeURIComponent('Account created successfully! Please log in.') 
                }
              });
            }, 2000);
          },
          error: (error) => {
            console.error('Signup error:', error);
            this.handleSignupError(error);
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

  private getInvalidFields(): string[] {
    const invalidFields: string[] = [];
    
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      if (control && control.invalid) {
        invalidFields.push(this.getFieldLabel(key));
      }
    });
    
    // Check for form-level errors (password mismatch)
    if (this.signupForm.errors?.['passwordMismatch']) {
      if (!invalidFields.includes('Password confirmation')) {
        invalidFields.push('Password confirmation');
      }
    }
    
    return invalidFields;
  }

  private handleSignupError(error: any): void {
    this.successMessage = '';
    
    if (error.status === 409) {
      if (error.message && error.message.toLowerCase().includes('email')) {
        this.errorMessage = 'This email address is already registered. Please use a different email or try logging in.';
      } else if (error.message && error.message.toLowerCase().includes('username')) {
        this.errorMessage = 'This username is already taken. Please choose a different username.';
      } else {
        this.errorMessage = 'Account already exists. Please try logging in instead.';
      }
    } else if (error.status === 422) {
      this.errorMessage = error.message || 'Please check your information and try again.';
    } else if (error.status === 400) {
      this.errorMessage = error.message || 'Invalid information provided. Please check your input.';
    } else if (error.status === 0) {
      this.errorMessage = 'Unable to connect to server. Please check your internet connection and ensure the backend server is running.';
    } else if (error.status >= 500) {
      this.errorMessage = 'Server error. Please try again later.';
    } else {
      this.errorMessage = error.message || 'Registration failed. Please try again.';
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
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
      if (errors?.['invalidName']) {
        return 'Full name can only contain letters, spaces, hyphens, and apostrophes';
      }
      if (errors?.['invalidUsername']) {
        return 'Username can only contain letters, numbers, underscores, and hyphens';
      }
      if (errors?.['weakPassword']) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      }
    }
    
    // Check for password mismatch
    if (fieldName === 'confirmPassword' && this.signupForm.errors?.['passwordMismatch'] && field?.touched) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'fullName': 'Full name',
      'email': 'Email',
      'username': 'Username',
      'password': 'Password',
      'confirmPassword': 'Confirm password',
      'country': 'Country'
    };
    return labels[fieldName] || this.capitalizeFirst(fieldName);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
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

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToLogin(): void {
    console.log('Navigating to login...');
    this.router.navigate(['/features/login']).then(
      (success) => {
        console.log('Navigation success:', success);
      },
      (error) => {
        console.error('Navigation error:', error);
      }
    );
  }

  // Utility methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFormControl(fieldName: string) {
    return this.signupForm.get(fieldName);
  }

  // Custom Validators
  private passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    // Only validate if both fields have values
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private nameValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    
    const value = control.value.toString().trim();
    if (!value) return { required: true };
    
    // Allow letters, spaces, hyphens, apostrophes, and some international characters
    const namePattern = /^[a-zA-ZÀ-ÿĀ-žА-я\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\s'-]+$/;
    
    if (!namePattern.test(value)) {
      return { invalidName: true };
    }
    return null;
  }

  private usernameValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    
    const value = control.value.toString().trim();
    if (!value) return { required: true };
    
    // Allow letters, numbers, underscores, and hyphens
    const usernamePattern = /^[a-zA-Z0-9_-]+$/;
    
    if (!usernamePattern.test(value)) {
      return { invalidUsername: true };
    }
    return null;
  }

  private passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    
    const password = control.value.toString().trim();
    if (!password) return { required: true };
    
    // For now, just check minimum length - you can enhance this later
    if (password.length < 6) {
      return { minlength: { requiredLength: 6, actualLength: password.length } };
    }
    
    // Optional: Add strength requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumeric || !hasSpecialChar) {
      return { weakPassword: true };
    }
    
    return null;
  }
}