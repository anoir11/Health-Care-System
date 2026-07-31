import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type PatientTab = 'overview' | 'folder' | 'appointments' | 'prescriptions';
export type AvatarColor = 'green' | 'blue' | 'purple' | 'rose' | 'amber' | 'teal';

export interface MedicalDocument {
  id: string;
  title: string;
  category: 'prescription' | 'lab' | 'imaging' | 'report';
  date: Date;
  addedBy: string;
}

export interface Prescription {
  id: string;
  date: Date;
  medications: string[];
  diagnosis: string;
}

export interface AppointmentRecord {
  id: string;
  date: Date;
  reason: string;
  status: 'done' | 'upcoming' | 'cancelled';
}

export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
  color: AvatarColor;
  phone: string;
  email: string;
  bloodType: string;
  lastVisit: Date;
  nextVisit?: Date;
  totalVisits: number;
  isNew: boolean;
  allergies: string[];
  conditions: string[];
  currentMedications: string[];
  accessLevel: 'full' | 'selective';
  documents: MedicalDocument[];
  prescriptions: Prescription[];
  appointments: AppointmentRecord[];
}

const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Amine Ben Ali',
    initials: 'AB',
    age: 28,
    gender: 'Male',
    color: 'green',
    phone: '+216 55 123 456',
    email: 'amine@email.com',
    bloodType: 'A+',
    lastVisit: new Date('2026-05-01'),
    nextVisit: new Date('2026-05-06'),
    totalVisits: 12,
    isNew: false,
    allergies: ['Penicillin', 'Aspirin'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    currentMedications: ['Bisoprolol 5mg', 'Metformin 500mg', 'Atorvastatin 20mg'],
    accessLevel: 'full',
    documents: [
      { id: 'd1', title: 'Blood test — CBC', category: 'lab', date: new Date('2026-04-10'), addedBy: 'Laboratoire Pasteur' },
      { id: 'd2', title: 'Cardiac MRI', category: 'imaging', date: new Date('2026-03-18'), addedBy: 'Dr. Mohamed Karim' },
      {
        id: 'd3',
        title: 'Prescription — Aspirin + Atorvastatin',
        category: 'prescription',
        date: new Date('2026-04-10'),
        addedBy: 'Dr. Sarah Johnson',
      },
    ],
    prescriptions: [
      {
        id: 'rx1',
        date: new Date('2026-04-10'),
        medications: ['Aspirin 100mg', 'Atorvastatin 20mg'],
        diagnosis: 'Hyperlipidemia management',
      },
      { id: 'rx2', date: new Date('2026-02-15'), medications: ['Bisoprolol 5mg', 'Lisinopril 10mg'], diagnosis: 'Hypertension follow-up' },
    ],
    appointments: [
      { id: 'a1', date: new Date('2026-05-01'), reason: 'Cardiology follow-up', status: 'done' },
      { id: 'a2', date: new Date('2026-05-06'), reason: 'Lab results review', status: 'upcoming' },
      { id: 'a3', date: new Date('2026-03-05'), reason: 'Routine checkup', status: 'done' },
    ],
  },
  {
    id: 'p2',
    name: 'Fatma Trabelsi',
    initials: 'FT',
    age: 45,
    gender: 'Female',
    color: 'blue',
    phone: '+216 98 222 333',
    email: 'fatma@email.com',
    bloodType: 'O+',
    lastVisit: new Date('2026-05-01'),
    totalVisits: 1,
    isNew: true,
    allergies: [],
    conditions: [],
    currentMedications: [],
    accessLevel: 'selective',
    documents: [],
    prescriptions: [],
    appointments: [{ id: 'a1', date: new Date('2026-05-01'), reason: 'First visit · Chest pain', status: 'done' }],
  },
  {
    id: 'p3',
    name: 'Karim Mansouri',
    initials: 'KM',
    age: 52,
    gender: 'Male',
    color: 'purple',
    phone: '+216 71 444 555',
    email: 'karim@email.com',
    bloodType: 'B+',
    lastVisit: new Date('2026-04-28'),
    nextVisit: new Date('2026-05-10'),
    totalVisits: 8,
    isNew: false,
    allergies: ['Sulfa'],
    conditions: ['Hypertension'],
    currentMedications: ['Amlodipine 10mg'],
    accessLevel: 'full',
    documents: [
      { id: 'd1', title: 'ECG Report', category: 'report', date: new Date('2026-04-28'), addedBy: 'Dr. Sarah Johnson' },
      { id: 'd2', title: 'Blood pressure monitoring', category: 'lab', date: new Date('2026-04-01'), addedBy: 'Clinique du Lac' },
    ],
    prescriptions: [{ id: 'rx1', date: new Date('2026-04-28'), medications: ['Amlodipine 10mg'], diagnosis: 'Hypertension control' }],
    appointments: [
      { id: 'a1', date: new Date('2026-04-28'), reason: 'Hypertension check-up', status: 'done' },
      { id: 'a2', date: new Date('2026-05-10'), reason: 'Blood pressure follow-up', status: 'upcoming' },
    ],
  },
  {
    id: 'p4',
    name: 'Sonia Belhaj',
    initials: 'SB',
    age: 38,
    gender: 'Female',
    color: 'rose',
    phone: '+216 92 666 777',
    email: 'sonia@email.com',
    bloodType: 'AB-',
    lastVisit: new Date('2026-04-20'),
    nextVisit: new Date('2026-05-11'),
    totalVisits: 5,
    isNew: false,
    allergies: [],
    conditions: ['Post-cardiac surgery'],
    currentMedications: ['Warfarin 5mg', 'Aspirin 100mg'],
    accessLevel: 'full',
    documents: [
      { id: 'd1', title: 'Post-surgery report', category: 'report', date: new Date('2026-04-20'), addedBy: 'Dr. Sarah Johnson' },
      { id: 'd2', title: 'Chest X-Ray', category: 'imaging', date: new Date('2026-03-10'), addedBy: 'Polyclinique El Menzah' },
    ],
    prescriptions: [
      {
        id: 'rx1',
        date: new Date('2026-04-20'),
        medications: ['Warfarin 5mg', 'Aspirin 100mg'],
        diagnosis: 'Post-surgery anticoagulation',
      },
    ],
    appointments: [
      { id: 'a1', date: new Date('2026-04-20'), reason: 'Post-surgery follow-up', status: 'done' },
      { id: 'a2', date: new Date('2026-05-11'), reason: 'Wound check', status: 'upcoming' },
    ],
  },
  {
    id: 'p5',
    name: 'Mohamed Sassi',
    initials: 'MS',
    age: 61,
    gender: 'Male',
    color: 'amber',
    phone: '+216 55 888 999',
    email: 'mohamed@email.com',
    bloodType: 'A-',
    lastVisit: new Date('2026-04-15'),
    totalVisits: 20,
    isNew: false,
    allergies: ['Ibuprofen'],
    conditions: ['Atrial fibrillation', 'Type 2 Diabetes'],
    currentMedications: ['Digoxin 0.25mg', 'Metformin 1000mg', 'Warfarin 3mg'],
    accessLevel: 'full',
    documents: [
      { id: 'd1', title: 'ECG — Atrial fibrillation', category: 'report', date: new Date('2026-04-15'), addedBy: 'Dr. Sarah Johnson' },
      { id: 'd2', title: 'Blood glucose levels', category: 'lab', date: new Date('2026-04-01'), addedBy: 'Laboratoire Pasteur' },
    ],
    prescriptions: [
      {
        id: 'rx1',
        date: new Date('2026-04-15'),
        medications: ['Digoxin 0.25mg', 'Warfarin 3mg'],
        diagnosis: 'Atrial fibrillation management',
      },
    ],
    appointments: [
      { id: 'a1', date: new Date('2026-04-15'), reason: 'Routine ECG check', status: 'done' },
      { id: 'a2', date: new Date('2026-01-10'), reason: 'Medication review', status: 'cancelled' },
    ],
  },
];

@Component({
  selector: 'app-my-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-patients.component.html',
  styleUrls: ['./my-patients.component.scss'],
})
export class MyPatientsComponent {
  patients = signal<Patient[]>(MOCK_PATIENTS);
  selectedPatient = signal<Patient | null>(null);
  activeTab = signal<PatientTab>('overview');
  searchQuery = signal('');
  filterNew = signal(false);

  // Precomputed stats — kept out of the template because Angular template
  // expressions do NOT support arrow functions (`=>` triggers
  // NG5002: "Bindings cannot contain assignments" since `=` is parsed
  // as an assignment token). Any .filter/.map/.reduce with a lambda
  // must live here in the component class, not inline in the HTML.
  newPatientsCount = computed(() => this.patients().filter(p => p.isNew).length);
  upcomingApptCount = computed(() => this.patients().filter(p => p.nextVisit).length);
  fullAccessCount = computed(() => this.patients().filter(p => p.accessLevel === 'full').length);

  filteredPatients = computed(() => {
    let list = this.patients();
    const q = this.searchQuery().toLowerCase();
    if (q)
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) || p.conditions.some(c => c.toLowerCase().includes(q)) || p.bloodType.toLowerCase().includes(q),
      );
    if (this.filterNew()) list = list.filter(p => p.isNew);
    return list;
  });

  selectPatient(p: Patient) {
    this.selectedPatient.set(p);
    this.activeTab.set('overview');
  }

  closePanel() {
    this.selectedPatient.set(null);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatShortDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  formatApptMonth(date: Date): string {
    return date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
  }

  daysAgo(date: Date): string {
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  }

  categoryIcon(cat: string): string {
    return { prescription: '💊', lab: '🧪', imaging: '🩻', report: '📋' }[cat] ?? '📄';
  }

  categoryLabel(cat: string): string {
    return { prescription: 'Prescription', lab: 'Lab Result', imaging: 'Imaging', report: 'Report' }[cat] ?? cat;
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }
}
