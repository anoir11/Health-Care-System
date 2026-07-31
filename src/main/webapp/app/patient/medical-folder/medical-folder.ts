import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Models ──────────────────────────────────────────────────────────────────

export type DocCategory = 'prescription' | 'lab' | 'imaging' | 'report' | 'vaccination' | 'surgery';
export type SortKey = 'newest' | 'oldest' | 'doctor' | 'category';
export type ViewMode = 'list' | 'grid';
export type AccessLevel = 'full' | 'selective' | 'temp';

export interface MedicalDocument {
  id: string;
  title: string;
  category: DocCategory;
  doctor: string;
  clinic: string;
  date: Date;
  isShared: boolean;
  fileUrl?: string;
  note?: string;
}

export interface DoctorAccess {
  id: string;
  name: string;
  specialty: string;
  avatarInitials: string;
  accessLevel: AccessLevel;
  grantedDate: Date;
  expiresDate?: Date;
  sharedDocs: string[]; // doc ids
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DOCS: MedicalDocument[] = [
  {
    id: 'd1',
    title: 'Blood test — Complete Blood Count (CBC)',
    category: 'lab',
    doctor: 'Dr. Sarah Johnson',
    clinic: 'Laboratoire Pasteur, Tunis',
    date: new Date('2026-04-10'),
    isShared: true,
  },
  {
    id: 'd2',
    title: 'Prescription — Aspirin 100mg + Atorvastatin 20mg',
    category: 'prescription',
    doctor: 'Dr. Sarah Johnson',
    clinic: 'Clinique du Lac',
    date: new Date('2026-04-10'),
    isShared: false,
  },
  {
    id: 'd3',
    title: 'Cardiac MRI — Left ventricular function',
    category: 'imaging',
    doctor: 'Dr. Mohamed Karim',
    clinic: 'Polyclinique El Menzah',
    date: new Date('2026-03-18'),
    isShared: true,
  },
  {
    id: 'd4',
    title: 'Cardiology consultation report — Follow-up',
    category: 'report',
    doctor: 'Dr. Sarah Johnson',
    clinic: 'Clinique du Lac',
    date: new Date('2026-03-05'),
    isShared: true,
  },
  {
    id: 'd5',
    title: 'Chest X-Ray — Pre-operative assessment',
    category: 'imaging',
    doctor: 'Dr. Leila Mansouri',
    clinic: 'Institut Pasteur',
    date: new Date('2026-02-22'),
    isShared: false,
  },
  {
    id: 'd6',
    title: 'Lipid Panel — Cholesterol & Triglycerides',
    category: 'lab',
    doctor: 'Dr. Sarah Johnson',
    clinic: 'Laboratoire Pasteur, Tunis',
    date: new Date('2026-02-10'),
    isShared: true,
  },
  {
    id: 'd7',
    title: 'Prescription — Bisoprolol 5mg + Lisinopril 10mg',
    category: 'prescription',
    doctor: 'Dr. Mohamed Karim',
    clinic: 'Polyclinique El Menzah',
    date: new Date('2026-01-28'),
    isShared: false,
  },
  {
    id: 'd8',
    title: 'Echocardiography — Doppler full assessment',
    category: 'imaging',
    doctor: 'Dr. Mohamed Karim',
    clinic: 'Polyclinique El Menzah',
    date: new Date('2026-01-15'),
    isShared: true,
  },
];

const MOCK_DOCTORS: DoctorAccess[] = [
  {
    id: 'dr1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    avatarInitials: 'SJ',
    accessLevel: 'full',
    grantedDate: new Date('2025-12-01'),
    sharedDocs: ['d1', 'd2', 'd4', 'd6'],
  },
  {
    id: 'dr2',
    name: 'Dr. Mohamed Karim',
    specialty: 'Radiologist',
    avatarInitials: 'MK',
    accessLevel: 'selective',
    grantedDate: new Date('2026-01-10'),
    sharedDocs: ['d3', 'd8'],
  },
  {
    id: 'dr3',
    name: 'Dr. Leila Mansouri',
    specialty: 'General Practitioner',
    avatarInitials: 'LM',
    accessLevel: 'temp',
    grantedDate: new Date('2026-03-01'),
    expiresDate: new Date('2026-05-01'),
    sharedDocs: [],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-medical-folder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-folder.html',
  styleUrls: ['./medical-folder.scss'],
})
export class MedicalFolderComponent implements OnInit {
  // State
  activeCategory = signal<DocCategory | 'all'>('all');
  sortKey = signal<SortKey>('newest');
  viewMode = signal<ViewMode>('list');
  selectedDoc = signal<MedicalDocument | null>(null);
  activePanel = signal<'details' | 'access'>('details');
  searchQuery = signal('');
  showUploadModal = signal(false);

  // Data
  allDocs = signal<MedicalDocument[]>(MOCK_DOCS);
  doctors = signal<DoctorAccess[]>(MOCK_DOCTORS);

  // Computed
  filteredDocs = computed(() => {
    let docs = this.allDocs();
    const cat = this.activeCategory();
    const q = this.searchQuery().toLowerCase();
    const sort = this.sortKey();

    if (cat !== 'all') docs = docs.filter(d => d.category === cat);
    if (q)
      docs = docs.filter(
        d => d.title.toLowerCase().includes(q) || d.doctor.toLowerCase().includes(q) || d.clinic.toLowerCase().includes(q),
      );

    return [...docs].sort((a, b) => {
      if (sort === 'newest') return b.date.getTime() - a.date.getTime();
      if (sort === 'oldest') return a.date.getTime() - b.date.getTime();
      if (sort === 'doctor') return a.doctor.localeCompare(b.doctor);
      if (sort === 'category') return a.category.localeCompare(b.category);
      return 0;
    });
  });

  groupedDocs = computed(() => {
    const docs = this.filteredDocs();
    const groups = new Map<string, MedicalDocument[]>();
    for (const doc of docs) {
      const key = this.formatMonthYear(doc.date);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(doc);
    }
    return Array.from(groups.entries()).map(([month, items]) => ({ month, items }));
  });

  stats = computed(() => {
    const docs = this.allDocs();
    return {
      total: docs.length,
      lab: docs.filter(d => d.category === 'lab').length,
      imaging: docs.filter(d => d.category === 'imaging').length,
      prescription: docs.filter(d => d.category === 'prescription').length,
      doctorsWithAccess: this.doctors().length,
    };
  });

  ngOnInit() {
    this.selectedDoc.set(this.allDocs()[0]);
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  selectDoc(doc: MedicalDocument) {
    this.selectedDoc.set(doc);
    this.activePanel.set('details');
  }

  toggleShared(doc: MedicalDocument) {
    this.allDocs.update(docs => docs.map(d => (d.id === doc.id ? { ...d, isShared: !d.isShared } : d)));
    if (this.selectedDoc()?.id === doc.id) {
      this.selectedDoc.update(d => (d ? { ...d, isShared: !d.isShared } : d));
    }
  }

  revokeAccess(doctorId: string) {
    this.doctors.update(drs => drs.filter(d => d.id !== doctorId));
  }

  hasDocAccess(doctorId: string, docId: string): boolean {
    const dr = this.doctors().find(d => d.id === doctorId);
    return dr?.sharedDocs.includes(docId) ?? false;
  }

  toggleDocAccess(doctorId: string, docId: string) {
    this.doctors.update(drs =>
      drs.map(d => {
        if (d.id !== doctorId) return d;
        const has = d.sharedDocs.includes(docId);
        return {
          ...d,
          sharedDocs: has ? d.sharedDocs.filter(id => id !== docId) : [...d.sharedDocs, docId],
        };
      }),
    );
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  formatMonthYear(date: Date): string {
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  categoryLabel(cat: DocCategory | 'all'): string {
    const labels: Record<string, string> = {
      all: 'All',
      prescription: 'Prescriptions',
      lab: 'Lab Results',
      imaging: 'Imaging',
      report: 'Reports',
      vaccination: 'Vaccination',
      surgery: 'Surgery',
    };
    return labels[cat] ?? cat;
  }

  categoryIcon(cat: DocCategory | string): string {
    const icons: Record<string, string> = {
      prescription: '💊',
      lab: '🧪',
      imaging: '📸',
      report: '📋',
      vaccination: '💉',
      surgery: '🏥',
    };
    return icons[cat] ?? '📄';
  }

  accessLevelLabel(level: AccessLevel): string {
    return { full: 'Full Access', selective: 'Selective', temp: 'Temporary' }[level];
  }

  trackByDocId(_: number, doc: MedicalDocument) {
    return doc.id;
  }
  trackByDoctorId(_: number, d: DoctorAccess) {
    return d.id;
  }
  trackByMonth(_: number, g: { month: string }) {
    return g.month;
  }

  readonly categories: Array<DocCategory | 'all'> = ['all', 'prescription', 'lab', 'imaging', 'report'];
  readonly sortOptions: Array<{ key: SortKey; label: string }> = [
    { key: 'newest', label: 'Newest first' },
    { key: 'oldest', label: 'Oldest first' },
    { key: 'doctor', label: 'By doctor' },
    { key: 'category', label: 'By category' },
  ];
}
