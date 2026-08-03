import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserResponse } from '../shared_models/user.model';
import { LoginPayload, LoginResponse, PatientRegisterPayload } from '../shared_models/auth.model';
import { environment } from 'environments/environment.development';
import { StateStorageService } from 'app/core/auth/state-storage.service';

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private stateStorageService: StateStorageService,
  ) {}

  registerPatient(payload: PatientRegisterPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/register/patient`, payload);
  }

  registerDoctor(formData: FormData): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/register/doctor`, formData);
  }

  verifyEmail(payload: VerifyEmailPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/verify-email`, payload);
  }

  resendCode(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/resend-code`, { email });
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(tap(response => this.storeSession(response)));
  }

  private storeSession(response: LoginResponse): void {
    this.stateStorageService.storeAuthenticationToken(response.token, true);

    localStorage.setItem(
      'user',
      JSON.stringify({
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role,
      }),
    );
  }

  getToken(): string | null {
    return this.stateStorageService.getAuthenticationToken();
  }

  getCurrentUser(): LoginResponse | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.stateStorageService.clearAuthenticationToken();
    localStorage.removeItem('user');
  }
}
