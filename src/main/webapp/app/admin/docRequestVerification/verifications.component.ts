import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export type DocStatus = 'pending' | 'approved' | 'rejected';

export interface DoctorDocument {
  name: string;
  size: string;
  type: 'pdf' | 'jpg' | 'png';
  uploadedAt: string;
}

export interface DoctorRequest {
  id: string;
  fullName: string;
  initials: string;
  avatarBg: string;
  email: string;
  phone: string;
  city: string;
  specialty: string;
  clinic: string;
  licenseNumber: string;
  cinNumber: string;
  yearsExperience: number;
  submittedAgo: string;
  submittedDate: string;
  status: DocStatus;
  documents: DoctorDocument[];
}

export interface FilterOption {
  label: string;
  value: string;
  count: number;
}

@Component({
  selector: 'app-verifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verifications.component.html',
  styleUrls: ['./verifications.component.scss'],
})
export class VerificationsComponent implements OnInit {
  searchQuery = '';
  sortBy = 'newest';
  activeFilter = 'pending';
  adminNotes = '';

  selectedDoctor: DoctorRequest | null = null;
  currentIndex = 0;

  showRejectReason = false;
  selectedReason = '';
  rejectNote = '';
  isProcessing = false;

  approvedToday = 3;
  rejectedToday = 1;

  rejectionReasons = [
    'Missing diploma',
    'Invalid license number',
    'CIN mismatch',
    'Incomplete documents',
    'Unverifiable clinic',
    'Duplicate account',
  ];

  filterOptions: FilterOption[] = [
    { label: 'Pending', value: 'pending', count: 0 },
    { label: 'Approved', value: 'approved', count: 0 },
    { label: 'Rejected', value: 'rejected', count: 0 },
    { label: 'All', value: 'all', count: 0 },
  ];

  allDoctors: DoctorRequest[] = [
    {
      id: '1',
      fullName: 'Karim Mansour',
      initials: 'KM',
      avatarBg: '#3b82f6',
      email: 'k.mansour@gmail.com',
      phone: '+216 20 123 456',
      city: 'Tunis',
      specialty: 'Cardiology',
      clinic: 'Clinique du Lac',
      licenseNumber: 'TN-2019-4821',
      cinNumber: '09876543',
      yearsExperience: 11,
      submittedAgo: '2h ago',
      submittedDate: 'May 5, 2026 · 09:14',
      status: 'pending',
      documents: [
        { name: 'Diplome_Medecine_Mansour.pdf', size: '2.1 MB', type: 'pdf', uploadedAt: '2h ago' },
        { name: 'Licence_Medicale_TN4821.pdf', size: '840 KB', type: 'pdf', uploadedAt: '2h ago' },
        { name: 'CIN_KarimMansour.jpg', size: '320 KB', type: 'jpg', uploadedAt: '2h ago' },
      ],
    },
    {
      id: '2',
      fullName: 'Leila Trabelsi',
      initials: 'LT',
      avatarBg: '#8b5cf6',
      email: 'leila.trabelsi@outlook.com',
      phone: '+216 98 765 432',
      city: 'Sfax',
      specialty: 'Dermatology',
      clinic: 'Polyclinique Tunis',
      licenseNumber: 'TN-2021-3302',
      cinNumber: '12345678',
      yearsExperience: 6,
      submittedAgo: '5h ago',
      submittedDate: 'May 5, 2026 · 06:30',
      status: 'pending',
      documents: [
        { name: 'Diplome_Trabelsi_Dermato.pdf', size: '3.4 MB', type: 'pdf', uploadedAt: '5h ago' },
        { name: 'CV_Leila_Trabelsi.pdf', size: '1.2 MB', type: 'pdf', uploadedAt: '5h ago' },
      ],
    },
    {
      id: '3',
      fullName: 'Amine Gharbi',
      initials: 'AG',
      avatarBg: '#10b981',
      email: 'amine.gharbi@medecin.tn',
      phone: '+216 55 234 789',
      city: 'Sousse',
      specialty: 'Pediatrics',
      clinic: 'Hôpital Charles Nicolle',
      licenseNumber: 'TN-2016-1107',
      cinNumber: '07654321',
      yearsExperience: 14,
      submittedAgo: '1d ago',
      submittedDate: 'May 4, 2026 · 14:22',
      status: 'pending',
      documents: [
        { name: 'Diplome_Pediatrie_Gharbi.pdf', size: '2.8 MB', type: 'pdf', uploadedAt: '1d ago' },
        { name: 'Licence_TN1107.pdf', size: '910 KB', type: 'pdf', uploadedAt: '1d ago' },
        { name: 'CIN_Amine.jpg', size: '280 KB', type: 'jpg', uploadedAt: '1d ago' },
        { name: 'Attestation_CHN.pdf', size: '1.1 MB', type: 'pdf', uploadedAt: '1d ago' },
      ],
    },
    {
      id: '4',
      fullName: 'Nadia Bouzid',
      initials: 'NB',
      avatarBg: '#f59e0b',
      email: 'n.bouzid@gmail.com',
      phone: '+216 22 987 654',
      city: 'Monastir',
      specialty: 'Neurology',
      clinic: 'Clinique Hannibal',
      licenseNumber: 'TN-2018-2240',
      cinNumber: '11223344',
      yearsExperience: 9,
      submittedAgo: '1d ago',
      submittedDate: 'May 4, 2026 · 10:05',
      status: 'pending',
      documents: [
        { name: 'Diplome_Neurologie.pdf', size: '4.1 MB', type: 'pdf', uploadedAt: '1d ago' },
        { name: 'CIN_NadiaBouzid.png', size: '450 KB', type: 'png', uploadedAt: '1d ago' },
      ],
    },
    {
      id: '5',
      fullName: 'Sami Haddad',
      initials: 'SH',
      avatarBg: '#ef4444',
      email: 'sami.haddad@yahoo.fr',
      phone: '+216 71 456 789',
      city: 'Tunis',
      specialty: 'Orthopedics',
      clinic: 'Clinique El Amen',
      licenseNumber: 'TN-2014-0895',
      cinNumber: '99887766',
      yearsExperience: 16,
      submittedAgo: '2d ago',
      submittedDate: 'May 3, 2026 · 17:40',
      status: 'pending',
      documents: [
        { name: 'Diplome_Orthopedie_Haddad.pdf', size: '2.6 MB', type: 'pdf', uploadedAt: '2d ago' },
        { name: 'CV_SamiHaddad.pdf', size: '980 KB', type: 'pdf', uploadedAt: '2d ago' },
        { name: 'Licence_TN0895.pdf', size: '730 KB', type: 'pdf', uploadedAt: '2d ago' },
      ],
    },
    {
      id: '6',
      fullName: 'Farah Ben Slama',
      initials: 'FB',
      avatarBg: '#ec4899',
      email: 'f.benslama@gmail.com',
      phone: '+216 23 678 901',
      city: 'Tunis',
      specialty: 'Gynecology',
      clinic: 'Clinique La Marsa',
      licenseNumber: 'TN-2020-3891',
      cinNumber: '55443322',
      yearsExperience: 7,
      submittedAgo: '3d ago',
      submittedDate: 'May 2, 2026 · 11:15',
      status: 'approved',
      documents: [
        { name: 'Diplome_Gynecologie.pdf', size: '3.0 MB', type: 'pdf', uploadedAt: '3d ago' },
        { name: 'CIN_FarahBS.jpg', size: '290 KB', type: 'jpg', uploadedAt: '3d ago' },
      ],
    },
    {
      id: '7',
      fullName: 'Youssef Rekik',
      initials: 'YR',
      avatarBg: '#64748b',
      email: 'y.rekik@hotmail.com',
      phone: '+216 50 321 654',
      city: 'Bizerte',
      specialty: 'General medicine',
      clinic: 'Cabinet Privé Bizerte',
      licenseNumber: 'TN-2023-0012',
      cinNumber: '33221100',
      yearsExperience: 2,
      submittedAgo: '3d ago',
      submittedDate: 'May 2, 2026 · 08:50',
      status: 'rejected',
      documents: [{ name: 'CV_YRekik.pdf', size: '800 KB', type: 'pdf', uploadedAt: '3d ago' }],
    },
  ];

  pendingList: DoctorRequest[] = [];
  filteredList: DoctorRequest[] = [];

  ngOnInit(): void {
    this.applyFilters();
    this.updateFilterCounts();
  }

  setFilter(value: string): void {
    this.activeFilter = value;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.allDoctors];

    // Status filter
    if (this.activeFilter !== 'all') {
      result = result.filter(d => d.status === this.activeFilter);
    }

    // Search
    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        d =>
          d.fullName.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.clinic.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q),
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'oldest':
        result = result.reverse();
        break;
      case 'name':
        result = result.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'specialty':
        result = result.sort((a, b) => a.specialty.localeCompare(b.specialty));
        break;
    }

    this.filteredList = result;
    this.pendingList = this.allDoctors.filter(d => d.status === 'pending');
    this.updateFilterCounts();
  }

  updateFilterCounts(): void {
    this.filterOptions = [
      { label: 'Pending', value: 'pending', count: this.allDoctors.filter(d => d.status === 'pending').length },
      { label: 'Approved', value: 'approved', count: this.allDoctors.filter(d => d.status === 'approved').length },
      { label: 'Rejected', value: 'rejected', count: this.allDoctors.filter(d => d.status === 'rejected').length },
      { label: 'All', value: 'all', count: this.allDoctors.length },
    ];
  }

  selectDoctor(doc: DoctorRequest): void {
    this.selectedDoctor = doc;
    this.currentIndex = this.filteredList.indexOf(doc);
    this.adminNotes = '';
    this.showRejectReason = false;
    this.selectedReason = '';
    this.rejectNote = '';
  }

  closePanel(): void {
    this.selectedDoctor = null;
    this.showRejectReason = false;
  }

  navigateTo(dir: -1 | 1): void {
    const next = this.currentIndex + dir;
    if (next >= 0 && next < this.filteredList.length) {
      this.currentIndex = next;
      this.selectedDoctor = this.filteredList[next];
      this.showRejectReason = false;
      this.selectedReason = '';
    }
  }

  approveDoctor(): void {
    if (!this.selectedDoctor) return;
    this.isProcessing = true;

    // Simulate API call
    setTimeout(() => {
      this.selectedDoctor!.status = 'approved';
      this.approvedToday++;
      this.isProcessing = false;
      this.applyFilters();

      // Auto-navigate to next pending
      const nextPending = this.filteredList.find(d => d.status === 'pending' && d.id !== this.selectedDoctor!.id);
      if (nextPending) {
        this.selectDoctor(nextPending);
      } else {
        this.closePanel();
      }
    }, 800);
  }

  confirmReject(): void {
    if (!this.selectedDoctor || !this.selectedReason) return;
    this.isProcessing = true;

    setTimeout(() => {
      this.selectedDoctor!.status = 'rejected';
      this.rejectedToday++;
      this.isProcessing = false;
      this.showRejectReason = false;
      this.selectedReason = '';
      this.rejectNote = '';
      this.applyFilters();

      const nextPending = this.filteredList.find(d => d.status === 'pending' && d.id !== this.selectedDoctor!.id);
      if (nextPending) {
        this.selectDoctor(nextPending);
      } else {
        this.closePanel();
      }
    }, 600);
  }

  undoDecision(): void {
    if (!this.selectedDoctor) return;
    this.selectedDoctor.status = 'pending';
    this.applyFilters();
  }

  trackById(_: number, d: DoctorRequest): string {
    return d.id;
  }
}
