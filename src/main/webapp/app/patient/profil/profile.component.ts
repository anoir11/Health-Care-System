import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmergencyContactFormValue, EmergencyContactModalComponent } from './emergency-contact-modal.component';
import { BloodType, Gender, PatientProfileResponse } from 'app/shared/shared_models/patient-profile.model';
import {
  ContactRole,
  EmergencyContactRequest,
  InsuranceRequest,
  PatientService,
  UpdatePatientProfileRequest,
} from 'app/shared/services/patient.service';
import { PdfExportService } from 'app/shared/services/pdf-export-patient_profile.service';

export type ProfileTab = 'personal' | 'medical' | 'insurance' | 'security';

export interface EmergencyContact {
  id: string;
  name: string;
  initials: string;
  relationship: string;
  role: 'primary' | 'secondary';
  phone: string;
  color: 'orange' | 'teal' | 'purple';
}

export interface PatientProfile {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  nationality: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  bloodType: string;
  height: number;
  weight: number;
  allergies: string[];
  conditions: string[];
  currentMedications: string[];
  smoking: boolean;
  alcohol: boolean;
  activeDoctors: number;
}

/** Draft shape used while the Personal Information card is in edit mode. */
export interface PersonalDraft {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string; // yyyy-MM-dd for <input type="date">
  nationality: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

/** Draft shape used while the Vitals card is in edit mode. */
export interface VitalsDraft {
  bloodType: string;
  height: number;
  weight: number;
  smoking: boolean;
  alcohol: boolean;
}

/** Draft shape used while the Insurance card is in edit mode. */
export interface InsuranceDraft {
  provider: string;
  policyNumber: string;
  expiryDate: string; // yyyy-MM-dd for <input type="date">
  coverage: string;
  active: boolean;
}

const BLOOD_TYPE_DISPLAY: Record<BloodType, string> = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
};

// Reverse lookup so the vitals edit form can post back an enum value.
const BLOOD_TYPE_FROM_DISPLAY: Record<string, BloodType> = Object.fromEntries(
  Object.entries(BLOOD_TYPE_DISPLAY).map(([k, v]) => [v, k as BloodType]),
) as Record<string, BloodType>;

const GENDER_DISPLAY: Record<Gender, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
};

const GENDER_FROM_DISPLAY: Record<string, Gender> = Object.fromEntries(
  Object.entries(GENDER_DISPLAY).map(([k, v]) => [v, k as Gender]),
) as Record<string, Gender>;

const CONTACT_COLORS: Array<'orange' | 'teal' | 'purple'> = ['orange', 'teal', 'purple'];

// Local model uses lowercase 'primary'/'secondary'; the backend's ContactRole
// enum is uppercase 'PRIMARY'/'SECONDARY'.
function toBackendRole(role: 'primary' | 'secondary'): ContactRole {
  return role === 'primary' ? 'PRIMARY' : 'SECONDARY';
}

function fromBackendRole(role: ContactRole): 'primary' | 'secondary' {
  return role === 'PRIMARY' ? 'primary' : 'secondary';
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, EmergencyContactModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  activeTab = signal<ProfileTab>('personal');

  // ── Edit-mode toggles (inline edit-in-place) ─────────────────────────────
  editingPersonal = signal(false);
  editingMedical = signal(false);
  editingInsurance = signal(false);

  // ── Saving/error state per card, so a failed save doesn't nuke the draft ──
  savingPersonal = signal(false);
  savingMedical = signal(false);
  savingInsurance = signal(false);
  personalError = signal('');
  medicalError = signal('');
  insuranceError = signal('');

  // ── Drafts: edited independently of the live signals, discarded on Cancel ─
  personalDraft = signal<PersonalDraft>(this.emptyPersonalDraft());
  vitalsDraft = signal<VitalsDraft>(this.emptyVitalsDraft());
  insuranceDraft = signal<InsuranceDraft>(this.emptyInsuranceDraft());

  // ── Emergency contact modal state ────────────────────────────────────────
  contactModalOpen = signal(false);
  contactBeingEdited = signal<EmergencyContact | null>(null);
  contactModalSaving = signal(false);
  contactModalError = signal('');

  // ── Allergies / Conditions / Medications — inline tag-list edit ─────────
  editingAllergies = signal(false);
  editingConditions = signal(false);
  editingMedications = signal(false);

  savingAllergies = signal(false);
  savingConditions = signal(false);
  savingMedications = signal(false);

  allergiesError = signal('');
  conditionsError = signal('');
  medicationsError = signal('');

  allergiesDraft = signal<string[]>([]);
  conditionsDraft = signal<string[]>([]);
  medicationsDraft = signal<string[]>([]);

  newAllergyInput = signal('');
  newConditionInput = signal('');
  newMedicationInput = signal('');

  isLoading = signal(true);
  loadError = signal('');

  profile = signal<PatientProfile>({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: new Date(),
    nationality: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    bloodType: '',
    height: 0,
    weight: 0,
    allergies: [],
    conditions: [],
    currentMedications: [],
    smoking: false,
    alcohol: false,
    activeDoctors: 0,
  });

  emergencyContacts = signal<EmergencyContact[]>([]);

  insurance = signal({
    provider: '',
    policyNumber: '',
    expiryDate: new Date(),
    coverage: '',
    status: 'active' as 'active' | 'expired',
  });

  constructor(
    private patientService: PatientService,
    private pdfExportService: PdfExportService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.patientService.getMyProfile().subscribe({
      next: res => {
        this.applyProfileResponse(res);
        this.isLoading.set(false);
      },
      error: err => {
        console.error('Failed to load profile:', err);
        this.loadError.set('Could not load your profile. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  private applyProfileResponse(res: PatientProfileResponse): void {
    this.profile.set({
      firstName: res.firstName,
      lastName: res.lastName,
      gender: res.gender ? GENDER_DISPLAY[res.gender] : '—',
      dateOfBirth: res.dateOfBirth ? new Date(res.dateOfBirth) : new Date(),
      nationality: res.nationality || '—',
      phone: res.phone,
      email: res.email,
      address: res.address || '—',
      city: res.city || '—',
      bloodType: res.bloodType ? BLOOD_TYPE_DISPLAY[res.bloodType] : '—',
      height: res.height ?? 0,
      weight: res.weight ?? 0,
      allergies: res.allergies || [],
      conditions: res.conditions || [],
      currentMedications: res.currentMedications || [],
      smoking: res.smoking,
      alcohol: res.alcohol,
      activeDoctors: res.activeDoctors,
    });

    this.emergencyContacts.set(
      res.emergencyContacts.map((ec, i) => ({
        id: String(ec.id),
        name: ec.name,
        initials: this.getInitials(ec.name),
        relationship: ec.relationship,
        role: fromBackendRole(ec.role),
        phone: ec.phone,
        color: CONTACT_COLORS[i % CONTACT_COLORS.length],
      })),
    );

    if (res.insurance) {
      this.insurance.set({
        provider: res.insurance.provider,
        policyNumber: res.insurance.policyNumber,
        expiryDate: new Date(res.insurance.expiryDate),
        coverage: res.insurance.coverage,
        status: res.insurance.active ? 'active' : 'expired',
      });
    }
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  get fullName(): string {
    const p = this.profile();
    return `${p.firstName} ${p.lastName}`;
  }

  get age(): number {
    const dob = this.profile().dateOfBirth;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  get bmi(): string {
    const p = this.profile();
    if (!p.height || !p.weight) return '—';
    const bmi = p.weight / (p.height / 100) ** 2;
    return bmi.toFixed(1);
  }

  get bmiLabel(): string {
    const b = parseFloat(this.bmi);
    if (isNaN(b)) return '—';
    if (b < 18.5) return 'Underweight';
    if (b < 25) return 'Normal';
    if (b < 30) return 'Overweight';
    return 'Obese';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  allergyType(a: string): 'red' | 'amber' {
    const food = ['Peanuts', 'Shellfish', 'Milk', 'Eggs', 'Wheat'];
    return food.includes(a) ? 'amber' : 'red';
  }

  allergyIcon(a: string): string {
    const food = ['Peanuts', 'Shellfish', 'Milk', 'Eggs', 'Wheat'];
    return food.includes(a) ? '⚠️' : '🚫';
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }
  trackByVal(_: number, val: string) {
    return val;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Personal Information — inline edit
  // ═══════════════════════════════════════════════════════════════════════

  // Builds a full UpdatePatientProfileRequest from the current live profile,
  // then applies overrides for whatever this particular save is changing.
  // This matters because the backend's smoking/alcohol fields are primitive
  // booleans (always overwritten) — so every save must carry the patient's
  // current values for them, not just the fields the open form is editing.
  private buildProfileUpdateRequest(overrides: Partial<UpdatePatientProfileRequest> = {}): UpdatePatientProfileRequest {
    const p = this.profile();
    return {
      firstName: p.firstName,
      lastName: p.lastName,
      phone: p.phone,
      gender: GENDER_FROM_DISPLAY[p.gender] ?? undefined,
      dateOfBirth: this.toDateInputValue(p.dateOfBirth),
      nationality: p.nationality === '—' ? undefined : p.nationality,
      address: p.address === '—' ? undefined : p.address,
      city: p.city === '—' ? undefined : p.city,
      bloodType: BLOOD_TYPE_FROM_DISPLAY[p.bloodType] ?? undefined,
      height: p.height,
      weight: p.weight,
      smoking: p.smoking,
      alcohol: p.alcohol,
      allergies: p.allergies,
      conditions: p.conditions,
      currentMedications: p.currentMedications,
      ...overrides,
    };
  }

  private emptyPersonalDraft(): PersonalDraft {
    return { firstName: '', lastName: '', gender: '', nationality: '', phone: '', email: '', address: '', city: '', dateOfBirth: '' };
  }

  startEditPersonal(): void {
    const p = this.profile();
    this.personalDraft.set({
      firstName: p.firstName,
      lastName: p.lastName,
      gender: p.gender,
      dateOfBirth: this.toDateInputValue(p.dateOfBirth),
      nationality: p.nationality === '—' ? '' : p.nationality,
      phone: p.phone,
      email: p.email, // display-only — the backend has no email field on this endpoint
      address: p.address === '—' ? '' : p.address,
      city: p.city === '—' ? '' : p.city,
    });
    this.personalError.set('');
    this.editingPersonal.set(true);
  }

  cancelEditPersonal(): void {
    this.editingPersonal.set(false);
    this.personalError.set('');
  }

  // Angular template expressions can't contain arrow functions, so the
  // template calls this instead of `personalDraft.update(d => ({...}))`.
  updatePersonalDraft(partial: Partial<PersonalDraft>): void {
    this.personalDraft.update(d => ({ ...d, ...partial }));
  }

  savePersonal(): void {
    const draft = this.personalDraft();

    if (!draft.firstName.trim() || !draft.lastName.trim()) {
      this.personalError.set('First and last name are required.');
      return;
    }

    if (!draft.dateOfBirth) {
      this.personalError.set('Date of birth is required.');
      return;
    }

    this.savingPersonal.set(true);
    this.personalError.set('');

    const payload = this.buildProfileUpdateRequest({
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      gender: GENDER_FROM_DISPLAY[draft.gender] ?? undefined,
      dateOfBirth: draft.dateOfBirth,
      nationality: draft.nationality.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      city: draft.city.trim(),
    });

    this.patientService.updateProfile(payload).subscribe({
      next: res => {
        this.applyProfileResponse(res);
        this.savingPersonal.set(false);
        this.editingPersonal.set(false);
      },
      error: err => {
        console.error('Failed to update personal info:', err);
        this.personalError.set('Could not save your changes. Please try again.');
        this.savingPersonal.set(false);
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Vitals (blood type, height, weight, smoking, alcohol) — inline edit
  // ═══════════════════════════════════════════════════════════════════════

  private emptyVitalsDraft(): VitalsDraft {
    return { bloodType: '', height: 0, weight: 0, smoking: false, alcohol: false };
  }

  bloodTypeOptions(): string[] {
    return Object.values(BLOOD_TYPE_DISPLAY);
  }

  startEditMedical(): void {
    const p = this.profile();
    this.vitalsDraft.set({
      bloodType: p.bloodType === '—' ? '' : p.bloodType,
      height: p.height,
      weight: p.weight,
      smoking: p.smoking,
      alcohol: p.alcohol,
    });
    this.medicalError.set('');
    this.editingMedical.set(true);
  }

  cancelEditMedical(): void {
    this.editingMedical.set(false);
    this.medicalError.set('');
  }

  // Angular template expressions can't contain arrow functions, so the
  // template calls this instead of `vitalsDraft.update(d => ({...}))`.
  updateVitalsDraft(partial: Partial<VitalsDraft>): void {
    this.vitalsDraft.update(d => ({ ...d, ...partial }));
  }

  // Height/weight inputs emit strings; do the numeric coercion here rather
  // than in the template (Angular's unary `+` in templates is unreliable).
  updateVitalsHeight(value: string | number): void {
    this.vitalsDraft.update(d => ({ ...d, height: Number(value) }));
  }

  updateVitalsWeight(value: string | number): void {
    this.vitalsDraft.update(d => ({ ...d, weight: Number(value) }));
  }

  saveMedical(): void {
    const draft = this.vitalsDraft();

    if (draft.height <= 0 || draft.weight <= 0) {
      this.medicalError.set('Height and weight must be greater than zero.');
      return;
    }

    this.savingMedical.set(true);
    this.medicalError.set('');

    const payload = this.buildProfileUpdateRequest({
      bloodType: BLOOD_TYPE_FROM_DISPLAY[draft.bloodType] ?? undefined,
      height: draft.height,
      weight: draft.weight,
      smoking: draft.smoking,
      alcohol: draft.alcohol,
    });

    this.patientService.updateProfile(payload).subscribe({
      next: res => {
        this.applyProfileResponse(res);
        this.savingMedical.set(false);
        this.editingMedical.set(false);
      },
      error: err => {
        console.error('Failed to update vitals:', err);
        this.medicalError.set('Could not save your changes. Please try again.');
        this.savingMedical.set(false);
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Insurance — inline edit
  // ═══════════════════════════════════════════════════════════════════════

  private emptyInsuranceDraft(): InsuranceDraft {
    return { provider: '', policyNumber: '', expiryDate: '', coverage: '', active: true };
  }

  private toDateInputValue(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  startEditInsurance(): void {
    const i = this.insurance();
    this.insuranceDraft.set({
      provider: i.provider,
      policyNumber: i.policyNumber,
      expiryDate: this.toDateInputValue(i.expiryDate),
      coverage: i.coverage,
      active: i.status === 'active',
    });
    this.insuranceError.set('');
    this.editingInsurance.set(true);
  }

  cancelEditInsurance(): void {
    this.editingInsurance.set(false);
    this.insuranceError.set('');
  }

  // Angular template expressions can't contain arrow functions, so the
  // template calls this instead of `insuranceDraft.update(d => ({...}))`.
  updateInsuranceDraft(partial: Partial<InsuranceDraft>): void {
    this.insuranceDraft.update(d => ({ ...d, ...partial }));
  }

  saveInsurance(): void {
    const draft = this.insuranceDraft();

    if (!draft.provider.trim() || !draft.policyNumber.trim() || !draft.expiryDate) {
      this.insuranceError.set('Provider, policy number and expiry date are required.');
      return;
    }

    this.savingInsurance.set(true);
    this.insuranceError.set('');

    const payload: InsuranceRequest = {
      provider: draft.provider.trim(),
      policyNumber: draft.policyNumber.trim(),
      expiryDate: draft.expiryDate, // yyyy-MM-dd
      coverage: draft.coverage.trim(),
      active: draft.active,
    };

    this.patientService.updateInsurance(payload).subscribe({
      next: res => {
        this.insurance.set({
          provider: res.provider,
          policyNumber: res.policyNumber,
          expiryDate: new Date(res.expiryDate),
          coverage: res.coverage,
          status: res.active ? 'active' : 'expired',
        });
        this.savingInsurance.set(false);
        this.editingInsurance.set(false);
      },
      error: err => {
        console.error('Failed to update insurance:', err);
        this.insuranceError.set('Could not save your changes. Please try again.');
        this.savingInsurance.set(false);
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Emergency contacts — modal (add / edit / delete)
  // ═══════════════════════════════════════════════════════════════════════

  openAddContact(): void {
    this.contactBeingEdited.set(null);
    this.contactModalError.set('');
    this.contactModalOpen.set(true);
  }

  openEditContact(contact: EmergencyContact): void {
    this.contactBeingEdited.set(contact);
    this.contactModalError.set('');
    this.contactModalOpen.set(true);
  }

  closeContactModal(): void {
    this.contactModalOpen.set(false);
    this.contactBeingEdited.set(null);
    this.contactModalError.set('');
  }

  saveContact(value: EmergencyContactFormValue): void {
    const editing = this.contactBeingEdited();
    this.contactModalSaving.set(true);
    this.contactModalError.set('');

    const payload: EmergencyContactRequest = {
      name: value.name,
      relationship: value.relationship,
      phone: value.phone,
      role: toBackendRole(value.role),
    };

    const request$ = editing
      ? this.patientService.updateEmergencyContact(editing.id, payload)
      : this.patientService.addEmergencyContact(payload);

    request$.subscribe({
      next: saved => {
        const id = String(saved.id);
        const role = fromBackendRole(saved.role);

        if (editing) {
          this.emergencyContacts.update(list =>
            list.map(c =>
              c.id === editing.id
                ? {
                    ...c,
                    name: saved.name,
                    initials: this.getInitials(saved.name),
                    relationship: saved.relationship,
                    phone: saved.phone,
                    role,
                  }
                : c,
            ),
          );
        } else {
          const nextColor = CONTACT_COLORS[this.emergencyContacts().length % CONTACT_COLORS.length];
          this.emergencyContacts.update(list => [
            ...list,
            {
              id,
              name: saved.name,
              initials: this.getInitials(saved.name),
              relationship: saved.relationship,
              phone: saved.phone,
              role,
              color: nextColor,
            },
          ]);
        }

        this.contactModalSaving.set(false);
        this.closeContactModal();
      },
      error: err => {
        console.error('Failed to save emergency contact:', err);
        this.contactModalError.set('Could not save this contact. Please try again.');
        this.contactModalSaving.set(false);
      },
    });
  }

  deleteContact(contact: EmergencyContact): void {
    this.contactModalSaving.set(true);
    this.contactModalError.set('');

    this.patientService.deleteEmergencyContact(contact.id).subscribe({
      next: () => {
        this.emergencyContacts.update(list => list.filter(c => c.id !== contact.id));
        this.contactModalSaving.set(false);
        this.closeContactModal();
      },
      error: err => {
        console.error('Failed to delete emergency contact:', err);
        this.contactModalError.set('Could not delete this contact. Please try again.');
        this.contactModalSaving.set(false);
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Allergies — inline tag-list edit (add / remove / save)
  // ═══════════════════════════════════════════════════════════════════════

  startEditAllergies(): void {
    this.allergiesDraft.set([...this.profile().allergies]);
    this.newAllergyInput.set('');
    this.allergiesError.set('');
    this.editingAllergies.set(true);
  }

  cancelEditAllergies(): void {
    this.editingAllergies.set(false);
    this.newAllergyInput.set('');
    this.allergiesError.set('');
  }

  addAllergyDraftItem(): void {
    const value = this.newAllergyInput().trim();
    if (!value) return;
    if (this.allergiesDraft().some(a => a.toLowerCase() === value.toLowerCase())) {
      this.newAllergyInput.set('');
      return;
    }
    this.allergiesDraft.update(list => [...list, value]);
    this.newAllergyInput.set('');
  }

  removeAllergyDraftItem(index: number): void {
    this.allergiesDraft.update(list => list.filter((_, i) => i !== index));
  }

  saveAllergies(): void {
    this.savingAllergies.set(true);
    this.allergiesError.set('');
    const updated = this.allergiesDraft();
    const payload = this.buildProfileUpdateRequest({ allergies: updated });

    this.patientService.updateProfile(payload).subscribe({
      next: res => {
        this.applyProfileResponse(res);
        this.savingAllergies.set(false);
        this.editingAllergies.set(false);
      },
      error: err => {
        console.error('Failed to update allergies:', err);
        this.allergiesError.set('Could not save your changes. Please try again.');
        this.savingAllergies.set(false);
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Chronic Conditions — inline tag-list edit (add / remove / save)
  // ═══════════════════════════════════════════════════════════════════════

  startEditConditions(): void {
    this.conditionsDraft.set([...this.profile().conditions]);
    this.newConditionInput.set('');
    this.conditionsError.set('');
    this.editingConditions.set(true);
  }

  cancelEditConditions(): void {
    this.editingConditions.set(false);
    this.newConditionInput.set('');
    this.conditionsError.set('');
  }

  addConditionDraftItem(): void {
    const value = this.newConditionInput().trim();
    if (!value) return;
    if (this.conditionsDraft().some(c => c.toLowerCase() === value.toLowerCase())) {
      this.newConditionInput.set('');
      return;
    }
    this.conditionsDraft.update(list => [...list, value]);
    this.newConditionInput.set('');
  }

  removeConditionDraftItem(index: number): void {
    this.conditionsDraft.update(list => list.filter((_, i) => i !== index));
  }

  saveConditions(): void {
    this.savingConditions.set(true);
    this.conditionsError.set('');
    const updated = this.conditionsDraft();
    const payload = this.buildProfileUpdateRequest({ conditions: updated });

    this.patientService.updateProfile(payload).subscribe({
      next: res => {
        this.applyProfileResponse(res);
        this.savingConditions.set(false);
        this.editingConditions.set(false);
      },
      error: err => {
        console.error('Failed to update conditions:', err);
        this.conditionsError.set('Could not save your changes. Please try again.');
        this.savingConditions.set(false);
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Current Medications — inline tag-list edit (add / remove / save)
  // ═══════════════════════════════════════════════════════════════════════

  startEditMedications(): void {
    this.medicationsDraft.set([...this.profile().currentMedications]);
    this.newMedicationInput.set('');
    this.medicationsError.set('');
    this.editingMedications.set(true);
  }

  cancelEditMedications(): void {
    this.editingMedications.set(false);
    this.newMedicationInput.set('');
    this.medicationsError.set('');
  }

  addMedicationDraftItem(): void {
    const value = this.newMedicationInput().trim();
    if (!value) return;
    if (this.medicationsDraft().some(m => m.toLowerCase() === value.toLowerCase())) {
      this.newMedicationInput.set('');
      return;
    }
    this.medicationsDraft.update(list => [...list, value]);
    this.newMedicationInput.set('');
  }

  removeMedicationDraftItem(index: number): void {
    this.medicationsDraft.update(list => list.filter((_, i) => i !== index));
  }

  saveMedications(): void {
    this.savingMedications.set(true);
    this.medicationsError.set('');
    const updated = this.medicationsDraft();
    const payload = this.buildProfileUpdateRequest({ currentMedications: updated });

    this.patientService.updateProfile(payload).subscribe({
      next: res => {
        this.applyProfileResponse(res);
        this.savingMedications.set(false);
        this.editingMedications.set(false);
      },
      error: err => {
        console.error('Failed to update medications:', err);
        this.medicationsError.set('Could not save your changes. Please try again.');
        this.savingMedications.set(false);
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Export Pdf profile patient data
  // ═══════════════════════════════════════════════════════════════════════

  exportPdf(): void {
    this.pdfExportService.exportProfile(
      this.profile(),
      this.fullName,
      this.age,
      this.bmi,
      this.bmiLabel,
      this.emergencyContacts(),
      this.insurance(),
    );
  }
}
