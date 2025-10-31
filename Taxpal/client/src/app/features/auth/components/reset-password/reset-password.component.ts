import { Component, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;

  isLoading = signal(false);
  message  = signal<string | null>(null);
  error    = signal<string | null>(null);

  private token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm:  ['', [Validators.required]]
      },
      { validators: ResetPasswordComponent.passwordsMatch }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  // Group-level validator (no `this` usage)
  static passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const p = group.get('password')?.value;
    const c = group.get('confirm')?.value;
    return p && c && p !== c ? { mismatch: true } : null;
  }

  submit(): void {
    if (this.form.invalid || !this.token) {
      this.form.markAllAsTouched();
      if (!this.token) this.error.set('Reset link is invalid or expired.');
      return;
    }

    this.isLoading.set(true);
    this.message.set(null);
    this.error.set(null);

    const password = this.form.value.password as string;

    // ✅ Call service with two arguments as your AuthService expects
    this.auth.resetPassword(this.token, password).subscribe({
      next: (res) => {
        this.message.set(res?.message || 'Your password has been reset.');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Unable to reset password.');
        this.isLoading.set(false);
      }
    });
  }
}
