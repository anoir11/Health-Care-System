import { AfterViewInit, Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterModule, RouterLink } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';

import { CommonModule } from '@angular/common';
import { AuthService } from 'app/shared/services/auth.service';

export type LoginRole = 'patient' | 'doctor';

@Component({
  selector: 'jhi-login',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent implements OnInit {
  form!: FormGroup;
  role: LoginRole = 'patient';

  showPassword = false;
  isSubmitting = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  setRole(role: LoginRole): void {
    this.role = role;
    this.loginError = '';
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.loginError = '';

    const { email, password } = this.form.value;

    this.authService.login({ email, password }).subscribe({
      next: response => {
        this.isSubmitting = false;

        // Guard: user picked "Doctor" tab but account is actually a Patient (or vice versa)
        const expectedRole = this.role.toUpperCase();
        if (response.role !== expectedRole) {
          this.authService.logout(); // clear the session we just stored
          this.loginError = `This account is registered as a ${response.role.toLowerCase()}, not a ${this.role}.`;
          return;
        }

        const redirect = response.role === 'PATIENT' ? '/m3' : '/doctor/dashboard';
        this.router.navigate([redirect]);
      },
      error: err => {
        this.isSubmitting = false;
        this.loginError =
          err.status === 400
            ? 'Incorrect email or password.'
            : err.status === 403
              ? err.error?.error || 'Your account is pending verification.'
              : 'Something went wrong. Please try again.';
      },
    });
  }
}
