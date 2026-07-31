export interface PatientRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR';
}
