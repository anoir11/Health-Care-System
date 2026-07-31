import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type UserRole = 'patient' | 'doctor';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface SuspensionEntry {
  date: string;
  reason: string;
}

export interface User {
  id: string;
  fullName: string;
  initials: string;
  avatarBg: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  lastActive: string;
  appointments: number;
  // doctor-only
  specialty?: string;
  clinic?: string;
  licenseNumber?: string;
  yearsExperience?: number;
  rating?: number;
  // suspension log
  suspensionLog?: SuspensionEntry[];
}

export interface QuickStat {
  value: string;
  label: string;
  color: string;
}

export interface RoleFilter {
  label: string;
  value: string;
  count: number;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersManagmentComponent implements OnInit {
  // ── State ──────────────────────────────────────────────────────────────────
  searchQuery = '';
  roleFilter = 'all';
  statusFilter = 'all';
  sortBy = 'newest';
  currentPage = 1;
  pageSize = 10;

  selectedUser: User | null = null;
  deleteTarget: User | null = null;
  showDeleteModal = false;
  isDeleting = false;
  selectedIds = new Set<string>();

  // ── Computed counts ────────────────────────────────────────────────────────
  get totalCount() {
    return this.allUsers.length;
  }
  get activeCount() {
    return this.allUsers.filter(u => u.status === 'active').length;
  }
  get patientCount() {
    return this.allUsers.filter(u => u.role === 'patient').length;
  }
  get doctorCount() {
    return this.allUsers.filter(u => u.role === 'doctor').length;
  }
  get suspendedCount() {
    return this.allUsers.filter(u => u.status === 'suspended').length;
  }

  roleFilters: RoleFilter[] = [];

  // ── Data ───────────────────────────────────────────────────────────────────
  allUsers: User[] = [
    {
      id: '1',
      fullName: 'Rania Ben Amor',
      initials: 'RB',
      avatarBg: '#3b82f6',
      email: 'rania.benamor@gmail.com',
      phone: '+216 20 111 222',
      city: 'Tunis',
      role: 'patient',
      status: 'active',
      joinedDate: 'Jan 12, 2025',
      lastActive: '2h ago',
      appointments: 8,
    },
    {
      id: '2',
      fullName: 'Dr. Karim Mansour',
      initials: 'KM',
      avatarBg: '#10b981',
      email: 'k.mansour@gmail.com',
      phone: '+216 20 123 456',
      city: 'Tunis',
      role: 'doctor',
      status: 'active',
      joinedDate: 'Mar 3, 2025',
      lastActive: '1d ago',
      appointments: 214,
      specialty: 'Cardiology',
      clinic: 'Clinique du Lac',
      licenseNumber: 'TN-2019-4821',
      yearsExperience: 11,
      rating: 4.8,
    },
    {
      id: '3',
      fullName: 'Tarek Hammami',
      initials: 'TH',
      avatarBg: '#f59e0b',
      email: 'tarek.h@outlook.com',
      phone: '+216 55 333 444',
      city: 'Sfax',
      role: 'patient',
      status: 'suspended',
      joinedDate: 'Feb 20, 2025',
      lastActive: '5d ago',
      appointments: 3,
      suspensionLog: [{ date: 'Apr 28, 2026', reason: 'Repeated no-shows & abusive messages' }],
    },
    {
      id: '4',
      fullName: 'Dr. Leila Trabelsi',
      initials: 'LT',
      avatarBg: '#8b5cf6',
      email: 'leila.trabelsi@outlook.com',
      phone: '+216 98 765 432',
      city: 'Sfax',
      role: 'doctor',
      status: 'active',
      joinedDate: 'Apr 10, 2025',
      lastActive: '3h ago',
      appointments: 98,
      specialty: 'Dermatology',
      clinic: 'Polyclinique Tunis',
      licenseNumber: 'TN-2021-3302',
      yearsExperience: 6,
      rating: 4.6,
    },
    {
      id: '5',
      fullName: 'Salma Khedher',
      initials: 'SK',
      avatarBg: '#ec4899',
      email: 'salma.kh@gmail.com',
      phone: '+216 22 555 666',
      city: 'Sousse',
      role: 'patient',
      status: 'active',
      joinedDate: 'May 1, 2025',
      lastActive: '30m ago',
      appointments: 12,
    },
    {
      id: '6',
      fullName: 'Dr. Amine Gharbi',
      initials: 'AG',
      avatarBg: '#06b6d4',
      email: 'amine.gharbi@medecin.tn',
      phone: '+216 55 234 789',
      city: 'Sousse',
      role: 'doctor',
      status: 'active',
      joinedDate: 'Jan 8, 2025',
      lastActive: '6h ago',
      appointments: 331,
      specialty: 'Pediatrics',
      clinic: 'Hôpital Charles Nicolle',
      licenseNumber: 'TN-2016-1107',
      yearsExperience: 14,
      rating: 4.9,
    },
    {
      id: '7',
      fullName: 'Mehdi Chaouachi',
      initials: 'MC',
      avatarBg: '#64748b',
      email: 'mehdi.ch@yahoo.fr',
      phone: '+216 71 777 888',
      city: 'Bizerte',
      role: 'patient',
      status: 'active',
      joinedDate: 'May 3, 2026',
      lastActive: '4h ago',
      appointments: 1,
    },
    {
      id: '8',
      fullName: 'Dr. Nadia Bouzid',
      initials: 'NB',
      avatarBg: '#f97316',
      email: 'n.bouzid@gmail.com',
      phone: '+216 22 987 654',
      city: 'Monastir',
      role: 'doctor',
      status: 'suspended',
      joinedDate: 'Jun 15, 2025',
      lastActive: '12d ago',
      appointments: 55,
      specialty: 'Neurology',
      clinic: 'Clinique Hannibal',
      licenseNumber: 'TN-2018-2240',
      yearsExperience: 9,
      rating: 3.2,
      suspensionLog: [{ date: 'Apr 15, 2026', reason: 'Patient complaint — misdiagnosis reported' }],
    },
    {
      id: '9',
      fullName: 'Amira Dridi',
      initials: 'AD',
      avatarBg: '#14b8a6',
      email: 'amira.dridi@gmail.com',
      phone: '+216 29 100 200',
      city: 'Tunis',
      role: 'patient',
      status: 'active',
      joinedDate: 'May 5, 2026',
      lastActive: '8m ago',
      appointments: 0,
    },
    {
      id: '10',
      fullName: 'Dr. Sami Haddad',
      initials: 'SH',
      avatarBg: '#ef4444',
      email: 'sami.haddad@yahoo.fr',
      phone: '+216 71 456 789',
      city: 'Tunis',
      role: 'doctor',
      status: 'active',
      joinedDate: 'Feb 2, 2025',
      lastActive: '1h ago',
      appointments: 187,
      specialty: 'Orthopedics',
      clinic: 'Clinique El Amen',
      licenseNumber: 'TN-2014-0895',
      yearsExperience: 16,
      rating: 4.7,
    },
    {
      id: '11',
      fullName: 'Houssem Ferchichi',
      initials: 'HF',
      avatarBg: '#a78bfa',
      email: 'h.ferchichi@hotmail.com',
      phone: '+216 50 321 654',
      city: 'Gabès',
      role: 'patient',
      status: 'active',
      joinedDate: 'Mar 18, 2025',
      lastActive: '2d ago',
      appointments: 5,
    },
    {
      id: '12',
      fullName: 'Dr. Farah Ben Slama',
      initials: 'FB',
      avatarBg: '#f43f5e',
      email: 'f.benslama@gmail.com',
      phone: '+216 23 678 901',
      city: 'Tunis',
      role: 'doctor',
      status: 'active',
      joinedDate: 'Jan 25, 2025',
      lastActive: '5h ago',
      appointments: 143,
      specialty: 'Gynecology',
      clinic: 'Clinique La Marsa',
      licenseNumber: 'TN-2020-3891',
      yearsExperience: 7,
      rating: 4.8,
    },
  ];

  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];

  // expose Math for template
  min = Math.min;

  ngOnInit(): void {
    this.applyFilters();
  }

  setRoleFilter(value: string): void {
    this.roleFilter = value;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let res = [...this.allUsers];

    if (this.roleFilter !== 'all') {
      res = res.filter(u => u.role === this.roleFilter);
    }
    if (this.statusFilter !== 'all') {
      res = res.filter(u => u.status === this.statusFilter);
    }

    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      res = res.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.city.toLowerCase().includes(q));
    }

    switch (this.sortBy) {
      case 'oldest':
        res = res.reverse();
        break;
      case 'name':
        res = res.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
    }

    this.filteredUsers = res;
    this.updatePagination();
    this.updateRoleFilters();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, start + this.pageSize);
  }

  updateRoleFilters(): void {
    this.roleFilters = [
      { label: 'All', value: 'all', count: this.allUsers.length },
      { label: 'Patients', value: 'patient', count: this.allUsers.filter(u => u.role === 'patient').length },
      { label: 'Doctors', value: 'doctor', count: this.allUsers.filter(u => u.role === 'doctor').length },
    ];
  }

  // ── Selection ──────────────────────────────────────────────────────────────
  toggleSelect(id: string, event: Event): void {
    event.stopPropagation();
    if (this.selectedIds.has(id)) this.selectedIds.delete(id);
    else this.selectedIds.add(id);
    this.selectedIds = new Set(this.selectedIds);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.paginatedUsers.forEach(u => this.selectedIds.add(u.id));
    else this.selectedIds.clear();
    this.selectedIds = new Set(this.selectedIds);
  }

  isAllSelected(): boolean {
    return this.paginatedUsers.length > 0 && this.paginatedUsers.every(u => this.selectedIds.has(u.id));
  }

  clearSelection(): void {
    this.selectedIds = new Set();
  }

  // ── Profile sidebar ────────────────────────────────────────────────────────
  selectUser(user: User): void {
    this.selectedUser = user;
  }
  closeProfile(): void {
    this.selectedUser = null;
  }

  getQuickStats(u: User): QuickStat[] {
    if (u.role === 'doctor') {
      return [
        { value: String(u.appointments), label: 'Appointments', color: '#3b82f6' },
        { value: u.rating ? u.rating.toFixed(1) + ' ★' : '—', label: 'Rating', color: '#f59e0b' },
        { value: u.yearsExperience + ' yrs', label: 'Experience', color: '#10b981' },
      ];
    }
    return [
      { value: String(u.appointments), label: 'Appointments', color: '#3b82f6' },
      { value: u.status === 'active' ? '✓' : '✗', label: 'Status', color: u.status === 'active' ? '#10b981' : '#e53e3e' },
      { value: u.suspensionLog?.length ? String(u.suspensionLog.length) : '0', label: 'Suspensions', color: '#f59e0b' },
    ];
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  toggleSuspend(user: User): void {
    user.status = user.status === 'suspended' ? 'active' : 'suspended';
    if (user.status === 'suspended') {
      user.suspensionLog = user.suspensionLog || [];
      user.suspensionLog.push({ date: 'May 5, 2026', reason: 'Suspended by admin' });
    }
    this.applyFilters();
  }

  promptDelete(user: User): void {
    this.deleteTarget = user;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteTarget = null;
  }

  confirmDelete(): void {
    if (!this.deleteTarget) return;
    this.isDeleting = true;
    setTimeout(() => {
      this.allUsers = this.allUsers.filter(u => u.id !== this.deleteTarget!.id);
      if (this.selectedUser?.id === this.deleteTarget!.id) this.selectedUser = null;
      this.selectedIds.delete(this.deleteTarget!.id);
      this.isDeleting = false;
      this.showDeleteModal = false;
      this.deleteTarget = null;
      this.applyFilters();
    }, 700);
  }

  bulkSuspend(): void {
    this.allUsers.forEach(u => {
      if (this.selectedIds.has(u.id)) u.status = 'suspended';
    });
    this.clearSelection();
    this.applyFilters();
  }

  bulkDelete(): void {
    this.allUsers = this.allUsers.filter(u => !this.selectedIds.has(u.id));
    if (this.selectedUser && this.selectedIds.has(this.selectedUser.id)) this.selectedUser = null;
    this.clearSelection();
    this.applyFilters();
  }

  // ── Pagination ─────────────────────────────────────────────────────────────
  totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  pageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  goPage(p: number): void {
    this.currentPage = p;
    this.updatePagination();
  }

  trackById(_: number, u: User): string {
    return u.id;
  }
}
