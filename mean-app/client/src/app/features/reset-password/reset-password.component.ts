import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  isLoading = false;
  showSuccessMessage = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  resetToken = '';
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Get the reset token from the route
    this.resetToken = this.route.snapshot.params['token'];
    if (!this.resetToken) {
      this.errorMessage = 'Invalid reset link. Please request a new password reset.';
    }

    // Subscribe to loading state if AuthService provides it
    if (this.authService.isLoading$) {
      this.authService.isLoading$
        .pipe(takeUntil(this.destroy$))
        .subscribe(loading => this.isLoading = loading);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Validator to check passwords match
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.errors?.['passwordMismatch']) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.valid && this.resetToken) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const newPassword = this.resetPasswordForm.get('newPassword')?.value;
        const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;

        await this.resetPassword(this.resetToken, newPassword, confirmPassword);

        this.showSuccessMessage = true;
        this.resetPasswordForm.reset();

        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login'], {
            queryParams: { message: 'Password reset successfully. Please log in with your new password.' }
          });
        }, 3000);

      } catch (error: any) {
        console.error('Error resetting password:', error);
        this.handleResetError(error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.resetPasswordForm.markAllAsTouched();
      if (!this.resetToken) {
        this.errorMessage = 'Invalid reset link. Please request a new password reset.';
      } else {
        this.errorMessage = 'Please fill in all required fields correctly.';
      }
    }
  }

  private handleResetError(error: any): void {
    if (error.status === 400) {
      this.errorMessage = 'Invalid or expired reset token. Please request a new password reset.';
    } else if (error.status === 422) {
      this.errorMessage = error.message || 'Password validation failed. Please check your input.';
    } else if (error.status === 429) {
      this.errorMessage = 'Too many reset attempts. Please try again in a few minutes.';
    } else if (error.status === 0) {
      this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
    } else {
      this.errorMessage = error.message || 'Failed to reset password. Please try again.';
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.resetPasswordForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors?.['minlength']) {
        const requiredLength = field.errors?.['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (field.errors?.['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'newPassword': 'New Password',
      'confirmPassword': 'Confirm Password'
    };
    return labels[fieldName] || this.capitalizeFirst(fieldName);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  togglePasswordVisibility(field: 'newPassword' | 'confirmPassword'): void {
    if (field === 'newPassword') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  goBackToLogin(): void {
    this.router.navigate(['/login']);
  }

  requestNewResetLink(): void {
    this.router.navigate(['/forgot-password']);
  }

  private async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authService.resetPassword(token, newPassword, confirmPassword)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => resolve(),
          error: (error) => reject(error)
        });
    });
  }
}
