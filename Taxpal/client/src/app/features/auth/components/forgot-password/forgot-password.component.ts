import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Forgot Password</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input type="email" formControlName="email" placeholder="Your email">
      <button type="submit" [disabled]="form.invalid || isLoading()">Send reset link</button>
    </form>
    <p *ngIf="message()">{{ message() }}</p>
    <p *ngIf="error()">{{ error() }}</p>
  `
})
export class ForgotPasswordComponent {
  form!: FormGroup;
  isLoading = signal(false);
  message = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    this.message.set(null); this.error.set(null);

    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: (res) => { this.message.set(res.message); this.isLoading.set(false); },
      error: (err) => { this.error.set(err.error?.message || 'Error'); this.isLoading.set(false); }
    });
  }
}
