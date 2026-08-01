import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  email = '';
  digits: string[] = ['', '', '', '', '', ''];

  isVerifying = false;
  isResending = false;
  errorMessage = '';
  successMessage = '';

  resendCooldown = 0;
  private cooldownTimer?: ReturnType<typeof setInterval>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';

    if (!this.email) {
      this.router.navigate(['/register']);
      return;
    }

    this.startCooldown(60);
  }

  ngOnDestroy(): void {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
  }

  get maskedEmail(): string {
    const [name, domain] = this.email.split('@');
    if (!domain) return this.email;
    const visible = name.slice(0, 2);
    return `${visible}${'*'.repeat(Math.max(name.length - 2, 2))}@${domain}`;
  }

  get code(): string {
    return this.digits.join('');
  }

  get isComplete(): boolean {
    return this.digits.every(d => d.length === 1);
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');

    this.digits[index] = value.slice(-1);
    input.value = this.digits[index];

    if (value && index < 5) {
      this.digitInputs.get(index + 1)?.nativeElement.focus();
    }

    this.errorMessage = '';

    if (this.isComplete) {
      this.verify();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      this.digitInputs.get(index - 1)?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/[^0-9]/g, '') || '';
    if (!pasted) return;

    const chars = pasted.slice(0, 6).split('');
    chars.forEach((char, i) => {
      this.digits[i] = char;
      const input = this.digitInputs.get(i)?.nativeElement;
      if (input) input.value = char;
    });

    const lastFilledIndex = Math.min(chars.length, 6) - 1;
    this.digitInputs.get(lastFilledIndex)?.nativeElement.focus();

    if (this.isComplete) {
      this.verify();
    }
  }

  verify(): void {
    if (!this.isComplete || this.isVerifying) return;

    this.isVerifying = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .verifyEmail({ email: this.email, code: this.code })
      .pipe(
        finalize(() => {
          this.isVerifying = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Email verified! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: err => {
          console.error('Verify error:', err);
          this.errorMessage = err.error?.error || 'Invalid or expired code. Please try again.';
          this.resetDigits();
        },
      });
  }

  resend(): void {
    if (this.resendCooldown > 0 || this.isResending) return;

    this.isResending = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .resendCode(this.email)
      .pipe(
        finalize(() => {
          this.isResending = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage = 'A new code has been sent.';
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000);
          this.resetDigits();
          this.startCooldown(60);
        },
        error: err => {
          console.error('Resend error:', err);
          this.errorMessage = err.error?.error || 'Could not resend code. Try again shortly.';
        },
      });
  }

  private resetDigits(): void {
    this.digits = ['', '', '', '', '', ''];
    this.digitInputs?.forEach(el => (el.nativeElement.value = ''));
    this.digitInputs?.first?.nativeElement.focus();
  }

  private startCooldown(seconds: number): void {
    this.resendCooldown = seconds;
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);

    this.cooldownTimer = setInterval(() => {
      this.resendCooldown--;
      this.cdr.detectChanges();

      if (this.resendCooldown <= 0 && this.cooldownTimer) {
        clearInterval(this.cooldownTimer);
      }
    }, 1000);
  }
}
