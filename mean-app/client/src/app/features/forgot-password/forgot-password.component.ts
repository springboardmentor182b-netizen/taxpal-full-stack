import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  showSuccessMessage = false;
  errorMessage = '';
  countdown = 5;

  private destroy$ = new Subject<void>();
  private countdownTimer: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  isEmailInvalid(): boolean {
    const emailControl = this.email;
    return !!(emailControl && emailControl.invalid && (emailControl.dirty || emailControl.touched));
  }

  async onSubmit(): Promise<void> {
    if (!this.forgotPasswordForm.valid) {
      this.forgotPasswordForm.markAllAsTouched();
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    const emailValue = this.email?.value.trim();
    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Simulate API call delay like your JS version
      await this.sendResetPasswordEmail(emailValue);

      this.showSuccessMessage = true;

      // Start countdown to navigate to login
      this.startCountdown();

    } catch (error: any) {
      this.handleResetError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private async sendResetPasswordEmail(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authService.forgotPassword(email)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
    });
  }

  resendEmail(): void {
    this.showSuccessMessage = false;
    this.countdown = 5;
    this.forgotPasswordForm.reset();
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  private startCountdown(): void {
    this.countdown = 5;
    this.countdownTimer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownTimer);
        this.navigateToLogin();
      }
    }, 1000);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  private handleResetError(error: any): void {
    if (error.status === 404) {
      this.errorMessage = 'Email address not found. Please check and try again.';
    } else if (error.status === 429) {
      this.errorMessage = 'Too many reset requests. Please try again in a few minutes.';
    } else if (error.status === 0) {
      this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
    } else {
      this.errorMessage = error.message || 'Failed to send reset email. Please try again.';
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.forgotPasswordForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) return 'Email is required';
      if (field.errors?.['email']) return 'Please enter a valid email address';
    }
    return '';
  }
}
