export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BloodType =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE';

export interface EmergencyContactResponse {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  role: 'PRIMARY' | 'SECONDARY';
}

export interface InsuranceResponse {
  provider: string;
  policyNumber: string;
  expiryDate: string; // ISO date string from backend
  coverage: string;
  active: boolean;
}

export interface PatientProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  gender: Gender | null;
  dateOfBirth: string | null; // ISO date string
  nationality: string | null;
  address: string | null;
  city: string | null;
  bloodType: BloodType | null;
  height: number | null;
  weight: number | null;
  smoking: boolean;
  alcohol: boolean;

  allergies: string[];
  conditions: string[];
  currentMedications: string[];

  emergencyContacts: EmergencyContactResponse[];
  insurance: InsuranceResponse | null;

  activeDoctors: number;
}
