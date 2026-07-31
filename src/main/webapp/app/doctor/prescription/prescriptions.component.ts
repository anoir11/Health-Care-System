import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  color: string;
  initials: string;
  type: 'medilink' | 'offline';
  allergies: string[];
  conditions: string[];
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  patientColor: string;
  patientType: 'medilink' | 'offline';
  diagnosis: string;
  date: string;
  medications: Medication[];
  notes?: string;
}

export interface AiMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  loading?: boolean;
}

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss'],
})
export class PrescriptionsComponent {
  // Signals
  searchQuery = signal<string>('');
  showWriter = signal<boolean>(false);
  showAiChat = signal<boolean>(false);
  selectedPrescription = signal<Prescription | null>(null);

  // Writer form signals
  selectedPatientId = signal<string>('');
  diagnosis = signal<string>('');
  writerNotes = signal<string>('');
  medications = signal<Medication[]>([{ name: '', dosage: '', frequency: '', duration: '', notes: '' }]);

  // AI assistant signals
  aiInput = signal<string>('');
  aiMessages = signal<AiMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Hello Dr. Johnson! How can I assist you with prescriptions today?',
    },
  ]);

  // Mock patient data
  patients = signal<Patient[]>([
    {
      id: 'p1',
      name: 'Ahmed Ben Ali',
      age: 34,
      gender: 'Male',
      bloodType: 'O+',
      color: 'blue',
      initials: 'AB',
      type: 'medilink',
      allergies: ['Penicillin'],
      conditions: ['Hypertension'],
    },
    {
      id: 'p2',
      name: 'Sarra Mansour',
      age: 28,
      gender: 'Female',
      bloodType: 'A+',
      color: 'purple',
      initials: 'SM',
      type: 'medilink',
      allergies: [],
      conditions: ['Asthma'],
    },
    {
      id: 'p3',
      name: 'Mohamed Trabelsi',
      age: 52,
      gender: 'Male',
      bloodType: 'B+',
      color: 'grey',
      initials: 'MT',
      type: 'offline',
      allergies: ['Aspirin'],
      conditions: ['Type 2 Diabetes'],
    },
  ]);

  // Mock prescriptions data
  prescriptions = signal<Prescription[]>([
    {
      id: 'rx-1',
      patientId: 'p1',
      patientName: 'Ahmed Ben Ali',
      patientInitials: 'AB',
      patientColor: 'blue',
      patientType: 'medilink',
      diagnosis: 'Hypertension management',
      date: '2026-07-20',
      medications: [
        { name: 'Amlodipine', dosage: '5mg', frequency: '1x Daily', duration: '30 Days', notes: 'Take in the morning' },
        { name: 'Lisinopril', dosage: '10mg', frequency: '1x Daily', duration: '30 Days', notes: 'Take with food' },
      ],
      notes: 'Follow up in 1 month for blood pressure re-evaluation.',
    },
    {
      id: 'rx-2',
      patientId: 'p3',
      patientName: 'Mohamed Trabelsi',
      patientInitials: 'MT',
      patientColor: 'grey',
      patientType: 'offline',
      diagnosis: 'Type 2 Diabetes follow-up',
      date: '2026-07-15',
      medications: [{ name: 'Metformin', dosage: '500mg', frequency: '2x Daily', duration: '60 Days', notes: 'Take with meals' }],
    },
  ]);

  // Computed properties
  filteredPrescriptions = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.prescriptions();
    return this.prescriptions().filter(
      rx =>
        rx.patientName.toLowerCase().includes(q) ||
        rx.diagnosis.toLowerCase().includes(q) ||
        rx.medications.some(m => m.name.toLowerCase().includes(q)),
    );
  });

  mediLinkPatients = computed(() => this.patients().filter(p => p.type === 'medilink'));
  offlinePatients = computed(() => this.patients().filter(p => p.type === 'offline'));

  selectedPatient = computed(() => this.patients().find(p => p.id === this.selectedPatientId()) || null);

  canSubmit = computed(() => {
    return (
      this.selectedPatientId().length > 0 && this.diagnosis().trim().length > 0 && this.medications().some(m => m.name.trim().length > 0)
    );
  });

  // UI Actions
  selectPrescription(rx: Prescription) {
    this.selectedPrescription.set(rx);
    this.showWriter.set(false);
  }

  openWriter() {
    this.showWriter.set(true);
    this.selectedPatientId.set('');
    this.diagnosis.set('');
    this.writerNotes.set('');
    this.medications.set([{ name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  }

  closeWriter() {
    this.showWriter.set(false);
  }

  addMedication() {
    this.medications.update(meds => [...meds, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  }

  removeMedication(index: number) {
    this.medications.update(meds => meds.filter((_, i) => i !== index));
  }

  updateMed(index: number, field: keyof Medication, value: string) {
    this.medications.update(meds => {
      const updated = [...meds];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  submitPrescription() {
    const patient = this.selectedPatient();
    if (!patient) return;

    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      patientInitials: patient.initials,
      patientColor: patient.color,
      patientType: patient.type,
      diagnosis: this.diagnosis(),
      date: new Date().toISOString().split('T')[0],
      medications: this.medications().filter(m => m.name.trim().length > 0),
      notes: this.writerNotes().trim() || undefined,
    };

    this.prescriptions.update(list => [newRx, ...list]);
    this.selectedPrescription.set(newRx);
    this.closeWriter();
  }

  // AI Assistant Methods
  handleAiKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendAiMessage();
    }
  }

  sendAiMessage() {
    const text = this.aiInput().trim();
    if (!text) return;

    const userMsg: AiMessage = { id: Date.now(), role: 'user', text };
    const loadingMsg: AiMessage = { id: Date.now() + 1, role: 'assistant', text: '', loading: true };

    this.aiMessages.update(msgs => [...msgs, userMsg, loadingMsg]);
    this.aiInput.set('');

    setTimeout(() => {
      this.aiMessages.update(msgs =>
        msgs.map(m =>
          m.loading
            ? {
                id: m.id,
                role: 'assistant',
                text: `Regarding "${text}": Always check for potential drug interactions with existing patient allergies before prescribing.`,
              }
            : m,
        ),
      );
    }, 1200);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // NEW: helper method to replace the inline arrow function that was
  // illegal inside the Angular template binding (NG5002 root cause).
  getMedsSummary(rx: Prescription): string {
    return rx.medications
      .slice(0, 2)
      .map(m => `${m.name} ${m.dosage}`)
      .join(' · ');
  }
}
