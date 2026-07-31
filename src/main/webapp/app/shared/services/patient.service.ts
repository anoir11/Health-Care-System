import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BloodType, Gender, PatientProfileResponse } from '../shared_models/patient-profile.model';
import { environment } from 'environments/environment.development';

export interface UpdatePersonalInfoRequest {
  firstName: string;
  lastName: string;
  gender?: Gender;
  nationality: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export interface UpdateVitalsRequest {
  bloodType?: BloodType;
  height: number;
  weight: number;
  smoking: boolean;
  alcohol: boolean;
}

export interface UpdateInsuranceRequest {
  provider: string;
  policyNumber: string;
  expiryDate: string; // yyyy-MM-dd
  coverage: string;
}

export type ContactRole = 'PRIMARY' | 'SECONDARY';

export interface UpdatePatientProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string; // LocalDate -> 'yyyy-MM-dd'
  nationality?: string;
  address?: string;
  city?: string;
  bloodType?: BloodType;
  height?: number;
  weight?: number;
  // Primitive booleans on the backend (no null check in the service) —
  // ALWAYS send the patient's current value for these two, even when this
  // particular save isn't about smoking/alcohol, or the backend will
  // silently reset them to false.
  smoking: boolean;
  alcohol: boolean;
  allergies?: string[];
  conditions?: string[];
  currentMedications?: string[];
}

export interface InsuranceRequest {
  provider: string;
  policyNumber: string;
  expiryDate?: string; // 'yyyy-MM-dd'
  coverage?: string;
  active: boolean;
}

export interface InsuranceResponse {
  provider: string;
  policyNumber: string;
  expiryDate: string;
  coverage: string;
  active: boolean;
}

export interface EmergencyContactRequest {
  name: string;
  relationship: string;
  phone: string;
  role: ContactRole;
}

export interface EmergencyContactResponse {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  role: ContactRole;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private baseUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<PatientProfileResponse> {
    return this.http.get<PatientProfileResponse>(`${this.baseUrl}/me`);
  }

  /**
   * Single unified update — backend applies null-safe partial updates for
   * most fields, but always overwrites smoking/alcohol, so always pass the
   * patient's current values for those two alongside whatever is changing.
   */
  updateProfile(payload: UpdatePatientProfileRequest): Observable<PatientProfileResponse> {
    return this.http.put<PatientProfileResponse>(`${this.baseUrl}/me`, payload);
  }

  updateInsurance(payload: InsuranceRequest): Observable<InsuranceResponse> {
    return this.http.put<InsuranceResponse>(`${this.baseUrl}/me/insurance`, payload);
  }

  deleteInsurance(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/me/insurance`);
  }

  addEmergencyContact(payload: EmergencyContactRequest): Observable<EmergencyContactResponse> {
    return this.http.post<EmergencyContactResponse>(`${this.baseUrl}/me/emergency-contacts`, payload);
  }

  updateEmergencyContact(contactId: string, payload: EmergencyContactRequest): Observable<EmergencyContactResponse> {
    return this.http.put<EmergencyContactResponse>(`${this.baseUrl}/me/emergency-contacts/${contactId}`, payload);
  }

  deleteEmergencyContact(contactId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/me/emergency-contacts/${contactId}`);
  }
}
