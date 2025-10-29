import { Component, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '@/app/core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent {
  form!: FormGroup;
  isLoading = signal(false);
  message = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor(private fb: FormBuilder, private auth: AuthService,private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    this.message.set(null);
    this.error.set(null);

    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: (res) => {
        this.message.set(res.message);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error');
        this.isLoading.set(false);
      }
    });
  }
}
