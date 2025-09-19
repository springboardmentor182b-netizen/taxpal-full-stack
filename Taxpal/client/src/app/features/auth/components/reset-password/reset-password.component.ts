// client/src/app/features/auth/components/reset-password/reset-password.component.ts
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Set a new password</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input type="password" placeholder="New password" formControlName="password" />
      <button type="submit" [disabled]="form.invalid || isLoading()">Update password</button>
    </form>
    <p *ngIf="message()">{{ message() }}</p>
    <p *ngIf="error()">{{ error() }}</p>
  `
})
export class ResetPasswordComponent {
  // inject deps so they are available for field initializers
  private fb     = inject(FormBuilder);
  private route  = inject(ActivatedRoute);
  private auth   = inject(AuthService);
  private router = inject(Router);

  // form: 1 field
  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // reactive UI state
  isLoading = signal(false);
  message   = signal<string | null>(null);
  error     = signal<string | null>(null);

  // token from query params
  private token: string = this.route.snapshot.queryParamMap.get('token') ?? '';

  submit() {
    if (this.form.invalid || !this.token) {
      this.error.set('Invalid or missing token');
      return;
    }

    this.isLoading.set(true);
    this.message.set(null);
    this.error.set(null);

    const pwd = this.form.value.password!;
    this.auth.resetPassword(this.token, pwd).subscribe({
      next: (res) => {
        this.message.set(res.message || 'Password updated successfully');
        this.isLoading.set(false);
        // Optional: navigate after success
        // this.router.navigate(['/login'], { queryParams: { reset: 'success' } });
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Error');
        this.isLoading.set(false);
      }
    });
  }
}
