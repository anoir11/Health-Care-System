import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  // Active Tab Signal
  activeTab = signal<'personal' | 'medical' | 'insurance' | 'security'>('personal');

  // Main Profile Signal Data
  profile = signal({
    firstName: 'Ahmed',
    lastName: 'Ben Ali',
    gender: 'Male',
    nationality: 'Tunisian',
    dateOfBirth: '1990-05-15',
    phone: '+216 20 123 456',
    email: 'ahmed.benali@example.com',
    address: 'Avenue Habib Bourguiba',
    city: 'Tunis',
    bloodType: 'O+',
    height: 178,
    weight: 75,
    activeDoctors: 3,
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Hypertension'],
    currentMedications: ['Lisinopril 10mg'],
    smoking: false,
    alcohol: false,
  });

  // Insurance Signal Data
  insurance = signal({
    provider: 'STAR Assurances',
    policyNumber: 'POL-9928104',
    expiryDate: '2026-12-31',
    coverage: 'Comprehensive',
    active: true,
  });

  // Emergency Contacts
  emergencyContacts = signal([
    {
      id: 1,
      name: 'Sarra Ben Ali',
      relationship: 'Spouse',
      role: 'primary',
      phone: '+216 22 987 654',
      initials: 'SA',
      color: 'red',
    },
  ]);

  // Editing States
  editingPersonal = signal(false);
  savingPersonal = signal(false);
  personalError = signal('');
  personalDraft = signal({ ...this.profile() });

  editingMedical = signal(false);
  savingMedical = signal(false);
  medicalError = signal('');
  vitalsDraft = signal({
    bloodType: this.profile().bloodType,
    height: this.profile().height,
    weight: this.profile().weight,
    smoking: this.profile().smoking,
    alcohol: this.profile().alcohol,
  });

  editingAllergies = signal(false);
  savingAllergies = signal(false);
  allergiesError = signal('');
  allergiesDraft = signal<string[]>([...this.profile().allergies]);
  newAllergyInput = signal('');

  editingConditions = signal(false);
  savingConditions = signal(false);
  conditionsError = signal('');
  conditionsDraft = signal<string[]>([...this.profile().conditions]);
  newConditionInput = signal('');

  editingMedications = signal(false);
  savingMedications = signal(false);
  medicationsError = signal('');
  medicationsDraft = signal<string[]>([...this.profile().currentMedications]);
  newMedicationInput = signal('');

  editingInsurance = signal(false);
  savingInsurance = signal(false);
  insuranceError = signal('');
  insuranceDraft = signal({ ...this.insurance() });

  contactModalOpen = signal(false);
  contactBeingEdited = signal<any>(null);
  contactModalSaving = signal(false);
  contactModalError = signal('');

  bloodTypeOptions = signal(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);

  // Computed Properties
  fullName = computed(() => `${this.profile().firstName} ${this.profile().lastName}`);

  age = computed(() => {
    const dob = new Date(this.profile().dateOfBirth);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  });

  bmi = computed(() => {
    const h = this.profile().height / 100;
    if (!h) return 0;
    return +(this.profile().weight / (h * h)).toFixed(1);
  });

  bmiLabel = computed(() => {
    const val = this.bmi();
    if (val < 18.5) return 'Underweight';
    if (val < 25) return 'Normal';
    if (val < 30) return 'Overweight';
    return 'Obese';
  });

  // Safe Field Updaters (Replaces Inline Arrow Functions)
  updatePersonalField(key: string, value: any) {
    this.personalDraft.update(d => ({ ...d, [key]: value }));
  }

  updateVitalsField(key: string, value: any) {
    this.vitalsDraft.update(d => ({ ...d, [key]: value }));
  }

  updateInsuranceField(key: string, value: any) {
    this.insuranceDraft.update(d => ({ ...d, [key]: value }));
  }

  // Personal Info Methods
  startEditPersonal() {
    this.personalDraft.set({ ...this.profile() });
    this.editingPersonal.set(true);
  }

  cancelEditPersonal() {
    this.editingPersonal.set(false);
  }

  savePersonal() {
    this.savingPersonal.set(true);
    this.profile.update(p => ({ ...p, ...this.personalDraft() }));
    this.savingPersonal.set(false);
    this.editingPersonal.set(false);
  }

  // Medical Vitals Methods
  startEditMedical() {
    this.vitalsDraft.set({
      bloodType: this.profile().bloodType,
      height: this.profile().height,
      weight: this.profile().weight,
      smoking: this.profile().smoking,
      alcohol: this.profile().alcohol,
    });
    this.editingMedical.set(true);
  }

  cancelEditMedical() {
    this.editingMedical.set(false);
  }

  saveMedical() {
    this.savingMedical.set(true);
    this.profile.update(p => ({ ...p, ...this.vitalsDraft() }));
    this.savingMedical.set(false);
    this.editingMedical.set(false);
  }

  // Allergies
  startEditAllergies() {
    this.allergiesDraft.set([...this.profile().allergies]);
    this.editingAllergies.set(true);
  }

  cancelEditAllergies() {
    this.editingAllergies.set(false);
  }

  addAllergyDraftItem() {
    const val = this.newAllergyInput().trim();
    if (val) {
      this.allergiesDraft.update(list => [...list, val]);
      this.newAllergyInput.set('');
    }
  }

  removeAllergyDraftItem(index: number) {
    this.allergiesDraft.update(list => list.filter((_, i) => i !== index));
  }

  saveAllergies() {
    this.savingAllergies.set(true);
    this.profile.update(p => ({ ...p, allergies: [...this.allergiesDraft()] }));
    this.savingAllergies.set(false);
    this.editingAllergies.set(false);
  }

  // Conditions
  startEditConditions() {
    this.conditionsDraft.set([...this.profile().conditions]);
    this.editingConditions.set(true);
  }

  cancelEditConditions() {
    this.editingConditions.set(false);
  }

  addConditionDraftItem() {
    const val = this.newConditionInput().trim();
    if (val) {
      this.conditionsDraft.update(list => [...list, val]);
      this.newConditionInput.set('');
    }
  }

  removeConditionDraftItem(index: number) {
    this.conditionsDraft.update(list => list.filter((_, i) => i !== index));
  }

  saveConditions() {
    this.savingConditions.set(true);
    this.profile.update(p => ({ ...p, conditions: [...this.conditionsDraft()] }));
    this.savingConditions.set(false);
    this.editingConditions.set(false);
  }

  // Medications
  startEditMedications() {
    this.medicationsDraft.set([...this.profile().currentMedications]);
    this.editingMedications.set(true);
  }

  cancelEditMedications() {
    this.editingMedications.set(false);
  }

  addMedicationDraftItem() {
    const val = this.newMedicationInput().trim();
    if (val) {
      this.medicationsDraft.update(list => [...list, val]);
      this.newMedicationInput.set('');
    }
  }

  removeMedicationDraftItem(index: number) {
    this.medicationsDraft.update(list => list.filter((_, i) => i !== index));
  }

  saveMedications() {
    this.savingMedications.set(true);
    this.profile.update(p => ({ ...p, currentMedications: [...this.medicationsDraft()] }));
    this.savingMedications.set(false);
    this.editingMedications.set(false);
  }

  // Insurance
  startEditInsurance() {
    this.insuranceDraft.set({ ...this.insurance() });
    this.editingInsurance.set(true);
  }

  cancelEditInsurance() {
    this.editingInsurance.set(false);
  }

  saveInsurance() {
    this.savingInsurance.set(true);
    this.insurance.set({ ...this.insuranceDraft() });
    this.savingInsurance.set(false);
    this.editingInsurance.set(false);
  }

  // Contacts
  openAddContact() {
    this.contactBeingEdited.set(null);
    this.contactModalOpen.set(true);
  }

  openEditContact(contact: any) {
    this.contactBeingEdited.set(contact);
    this.contactModalOpen.set(true);
  }

  closeContactModal() {
    this.contactModalOpen.set(false);
  }

  saveContact(contact: any) {
    /* implementation */
  }
  deleteContact(contact: any) {
    /* implementation */
  }

  // Utils
  formatDate(d: string): string {
    return d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  }

  allergyType(a: string): string {
    return 'food';
  }
  allergyIcon(a: string): string {
    return '⚠️';
  }
  exportPdf() {
    window.print();
  }
}
