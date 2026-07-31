import { AfterViewInit, Component, OnInit, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import SharedModule from 'app/shared/shared.module';
import PasswordStrengthBarComponent from '../password/password-strength-bar/password-strength-bar.component';
import { RegisterService } from './register.service';

import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/shared/services/auth.service';
import { DoctorDocumentType, UploadedDoc } from 'app/shared/shared_models/document.model';
export type UserRole = 'patient' | 'doctor';

interface Gauge {
  pct: number;
  dash: number;
  color: string;
}

type GaugeKey = 'lic' | 'cin';

@Component({
  selector: 'jhi-register',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, ReactiveFormsModule, CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export default class RegisterComponent implements OnInit {
  form!: FormGroup;
  role: UserRole = 'patient';
  uploadedFiles: File[] = [];
  isDragging = false;
  isSubmitting = false;
  uploadedDocs: UploadedDoc[] = [];
  docTypes: DoctorDocumentType[] = ['CIN', 'DIPLOMA', 'CV', 'LICENSE'];

  // Confidence gauges for license and CIN fields
  // gauges: Record<string, Gauge> = {
  //   lic: { pct: 0, dash: 0, color: '#f1f5f9' },
  //   cin: { pct: 0, dash: 0, color: '#f1f5f9' },
  // };

  gauges: Record<GaugeKey, Gauge> = {
    lic: { pct: 0, dash: 0, color: '#f1f5f9' },
    cin: { pct: 0, dash: 0, color: '#f1f5f9' },
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        // Doctor-only (validators applied dynamically)
        specialty: [''],
        licenseNumber: [''],
        cinNumber: [''],
        clinicName: [''],
        yearsExperience: [''],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  private passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
    const pw = g.get('password')?.value;
    const cpw = g.get('confirmPassword')?.value;
    return pw && cpw && pw !== cpw ? { mismatch: true } : null;
  }

  // ── Role switching ───────────────────────────────────────────────────────────
  setRole(role: UserRole): void {
    this.role = role;
    const doctorFields = ['specialty', 'licenseNumber', 'cinNumber', 'clinicName', 'yearsExperience'];
    doctorFields.forEach(field => {
      const ctrl = this.form.get(field)!;
      if (role === 'doctor') {
        ctrl.setValidators(Validators.required);
      } else {
        ctrl.clearValidators();
        ctrl.reset('');
      }
      ctrl.updateValueAndValidity();
    });
    // Reset gauges when switching away from doctor
    if (role === 'patient') {
      this.gauges.lic = { pct: 0, dash: 0, color: '#f1f5f9' };
      this.gauges.cin = { pct: 0, dash: 0, color: '#f1f5f9' };
    }
  }

  // ── Confidence gauges ────────────────────────────────────────────────────────
  // updateGauge(id: string, length: number, max: number): void {
  //   const pct   = Math.min(100, Math.round((length / max) * 100));
  //   const dash  = Math.round((pct / 100) * 69);   // 69 = circumference of r=11 circle
  //   const color = pct < 40 ? '#f59e0b' : pct < 80 ? '#e53e3e' : '#10b981';
  //   this.gauges[id] = { pct, dash, color };
  // }

  updateGauge(id: GaugeKey, length: number, max: number): void {
    const pct = Math.min(100, Math.round((length / max) * 100));
    const dash = Math.round((pct / 100) * 69);
    const color = pct < 40 ? '#f59e0b' : pct < 80 ? '#e53e3e' : '#10b981';

    this.gauges[id] = { pct, dash, color };
  }

  // ── File handling ────────────────────────────────────────────────────────────
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(e: DragEvent): void {
    this.isDragging = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging = false;
    if (e.dataTransfer?.files) {
      this.addFiles(Array.from(e.dataTransfer.files));
    }
  }

  private addFiles0(files: File[]): void {
    const valid = files.filter(f => f.size <= 5 * 1024 * 1024);
    this.uploadedFiles = [...this.uploadedFiles, ...valid];
  }

  private addFiles(files: File[]): void {
    const valid = files.filter(f => f.size <= 5 * 1024 * 1024);
    const newDocs: UploadedDoc[] = valid.map(file => ({ file, type: null }));
    this.uploadedDocs = [...this.uploadedDocs, ...newDocs];
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  setDocType(index: number, type: string): void {
    this.uploadedDocs[index].type = type as DoctorDocumentType;
  }

  // ── Validation helpers ───────────────────────────────────────────────────────
  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  get passwordMismatch(): boolean {
    return !!(this.form.errors?.['mismatch'] && this.form.get('confirmPassword')?.touched);
  }

  private validateDoctorDocs(): string | null {
    if (this.uploadedDocs.some(d => d.type === null)) {
      return 'Please select a document type for every uploaded file.';
    }
    const types = this.uploadedDocs.map(d => d.type);
    if (!types.includes('CIN')) return 'CIN document is required.';
    if (!types.includes('DIPLOMA')) return 'Diploma document is required.';
    if (!types.includes('CV')) return 'CV document is required.';
    return null;
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.role === 'doctor' && this.uploadedFiles.length === 0) {
      alert('Please upload at least one document (diploma, license, or CV).');
      return;
    }

    this.isSubmitting = true;

    const payload = {
      ...this.form.value,
      role: this.role,
      documents: this.uploadedFiles.map(f => f.name),
    };

    console.log('Register payload:', payload);

    // ── Replace with your AuthService ────────────────────────────────────────
    // this.authService.register(payload).subscribe({
    //   next: () => this.router.navigate([
    //     this.role === 'patient' ? '/home' : '/pending-verification'
    //   ]),
    //   error: err => {
    //     this.isSubmitting = false;
    //     console.error(err);
    //   }
    // });

    setTimeout(() => {
      this.isSubmitting = false;
    }, 1500);
  }
  errorMessage = '';
  onSubmit2(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';

    if (this.role === 'patient') {
      this.isSubmitting = true;

      const payload = {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        email: this.form.value.email,
        phone: this.form.value.phone,
        password: this.form.value.password,
      };

      this.authService.registerPatient(payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/verify-email']);
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
        },
      });
    } else {
      // Doctor flow — next step, not wired yet
      alert('Doctor registration will be wired next.');
    }
  }

  onSubmit3(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';

    if (this.role === 'patient') {
      this.isSubmitting = true;

      const payload = {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        email: this.form.value.email,
        phone: this.form.value.phone,
        password: this.form.value.password,
      };

      this.authService.registerPatient(payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/verify-email'], {
            queryParams: {
              email: payload.email,
            },
          });
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
        },
      });
    } else {
      const docError = this.validateDoctorDocs();
      if (docError) {
        this.errorMessage = docError;
        return;
      }

      this.isSubmitting = true;

      const formData = new FormData();
      formData.append('firstName', this.form.value.firstName);
      formData.append('lastName', this.form.value.lastName);
      formData.append('email', this.form.value.email);
      formData.append('phone', this.form.value.phone);
      formData.append('password', this.form.value.password);
      formData.append('specialty', this.form.value.specialty);
      formData.append('licenseNumber', this.form.value.licenseNumber);
      formData.append('cinNumber', this.form.value.cinNumber);
      formData.append('clinicName', this.form.value.clinicName);
      formData.append('yearsExperience', this.form.value.yearsExperience);

      const fieldMap: Record<DoctorDocumentType, string> = {
        CIN: 'cinDocument',
        DIPLOMA: 'diplomaDocument',
        CV: 'cvDocument',
        LICENSE: 'licenseDocument',
      };

      this.uploadedDocs.forEach(doc => {
        if (doc.type) {
          formData.append(fieldMap[doc.type], doc.file);
        }
      });

      this.authService.registerDoctor(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
        },
      });
    }
  }
}
