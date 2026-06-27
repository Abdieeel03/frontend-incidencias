import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@core/auth/services/auth.service';
import { AuthSubmitButtonComponent } from '@app/features/auth/components/auth-submit-button/auth-submit-button.component';

@Component({
  selector: 'app-login',
  imports: [AuthSubmitButtonComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const values = this.loginForm.getRawValue();
    this.authService.login(values).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.data) {
          this.router.navigate([this.authService.getDashboardPath(response.data.role)]);
        } else {
          this.errorMessage.set(response.message || 'Error al iniciar sesión.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Error al iniciar sesión. Inténtelo de nuevo.'
        );
      },
    });
  }
}
