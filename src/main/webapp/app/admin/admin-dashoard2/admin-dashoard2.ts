import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface StatCard {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: 'blue' | 'green' | 'amber' | 'red';
  icon: string;
}

export interface PendingDoctor {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  clinic: string;
  submittedAgo: string;
  avatarBg: string;
}

export interface ActivityItem {
  type: 'approve' | 'reject' | 'register' | 'report' | 'suspend';
  icon: string;
  text: string;
  time: string;
}

export interface SpecialtyBreakdown {
  name: string;
  count: number;
  pct: number;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

export interface RecentUser {
  name: string;
  initials: string;
  role: 'patient' | 'doctor';
  time: string;
  avatarBg: string;
}

export interface OpenReport {
  title: string;
  patient: string;
  doctor: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
}
@Component({
  selector: 'app-admin-dashoard2',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './admin-dashoard2.html',
  styleUrl: './admin-dashoard2.scss',
})
export class AdminDashoard2 implements OnInit {
  today = new Date();
  pendingCount = 7;
  openReports = 3;

  stats: StatCard[] = [
    {
      label: 'Total Patients',
      value: '12,481',
      trend: '+8.2%',
      trendUp: true,
      color: 'blue',
      icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    },
    {
      label: 'Active Doctors',
      value: '318',
      trend: '+3.5%',
      trendUp: true,
      color: 'green',
      icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    },
    {
      label: 'Pending Verifications',
      value: '7',
      trend: '+2',
      trendUp: false,
      color: 'amber',
      icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    },
    {
      label: 'Appointments Today',
      value: '234',
      trend: '+12.1%',
      trendUp: true,
      color: 'red',
      icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    },
  ];

  pendingDoctors: PendingDoctor[] = [
    {
      id: '1',
      name: 'Karim Mansour',
      initials: 'KM',
      specialty: 'Cardiology',
      clinic: 'Clinique du Lac',
      submittedAgo: '2h ago',
      avatarBg: '#3b82f6',
    },
    {
      id: '2',
      name: 'Leila Trabelsi',
      initials: 'LT',
      specialty: 'Dermatology',
      clinic: 'Polyclinique Tunis',
      submittedAgo: '5h ago',
      avatarBg: '#8b5cf6',
    },
    {
      id: '3',
      name: 'Amine Gharbi',
      initials: 'AG',
      specialty: 'Pediatrics',
      clinic: 'Hôpital Charles N.',
      submittedAgo: '1d ago',
      avatarBg: '#10b981',
    },
    {
      id: '4',
      name: 'Nadia Bouzid',
      initials: 'NB',
      specialty: 'Neurology',
      clinic: 'Clinique Hannibal',
      submittedAgo: '1d ago',
      avatarBg: '#f59e0b',
    },
    {
      id: '5',
      name: 'Sami Haddad',
      initials: 'SH',
      specialty: 'Orthopedics',
      clinic: 'Clinique El Amen',
      submittedAgo: '2d ago',
      avatarBg: '#ef4444',
    },
  ];

  activities: ActivityItem[] = [
    {
      type: 'approve',
      icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
      text: '<strong>Dr. Farah Ben Slama</strong> approved — Gynecology',
      time: '14 min ago',
    },
    {
      type: 'register',
      icon: '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>',
      text: '<strong>Rania Hamdi</strong> registered as patient',
      time: '31 min ago',
    },
    {
      type: 'report',
      icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
      text: 'New complaint filed against <strong>Dr. Malek Zouari</strong>',
      time: '1h ago',
    },
    {
      type: 'reject',
      icon: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      text: '<strong>Dr. Youssef Rekik</strong> rejected — missing diploma',
      time: '3h ago',
    },
    {
      type: 'register',
      icon: '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>',
      text: '<strong>Mehdi Chaouachi</strong> registered as patient',
      time: '4h ago',
    },
    {
      type: 'suspend',
      icon: '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>',
      text: '<strong>Dr. Ali Sassi</strong> account suspended',
      time: '6h ago',
    },
  ];

  specialtyBreakdown: SpecialtyBreakdown[] = [
    { name: 'General Medicine', count: 74, pct: 90, color: 'blue' },
    { name: 'Cardiology', count: 48, pct: 58, color: 'red' },
    { name: 'Dermatology', count: 42, pct: 51, color: 'purple' },
    { name: 'Pediatrics', count: 38, pct: 46, color: 'green' },
    { name: 'Orthopedics', count: 31, pct: 38, color: 'amber' },
    { name: 'Neurology', count: 27, pct: 33, color: 'blue' },
  ];

  recentUsers: RecentUser[] = [
    { name: 'Amira Dridi', initials: 'AD', role: 'patient', time: '8 min ago', avatarBg: '#3b82f6' },
    { name: 'Dr. Nour Sfaxi', initials: 'NS', role: 'doctor', time: '22 min ago', avatarBg: '#8b5cf6' },
    { name: 'Tarek Ben Amor', initials: 'TA', role: 'patient', time: '41 min ago', avatarBg: '#10b981' },
    { name: 'Dr. Hela Riahi', initials: 'HR', role: 'doctor', time: '1h ago', avatarBg: '#f59e0b' },
    { name: 'Salma Khedher', initials: 'SK', role: 'patient', time: '2h ago', avatarBg: '#ef4444' },
  ];

  openReportsList: OpenReport[] = [
    { title: 'Unprofessional conduct', patient: 'K. Hamdi', doctor: 'Zouari', severity: 'high', time: '1h ago' },
    { title: 'Incorrect prescription', patient: 'M. Tlili', doctor: 'Ghariani', severity: 'medium', time: '1d ago' },
    { title: 'No-show consultation', patient: 'S. Bejaoui', doctor: 'Mhamdi', severity: 'low', time: '2d ago' },
  ];

  ngOnInit(): void {}

  approveDoctor(id: string): void {
    this.pendingDoctors = this.pendingDoctors.filter(d => d.id !== id);
    this.pendingCount = this.pendingDoctors.length;
  }

  rejectDoctor(id: string): void {
    this.pendingDoctors = this.pendingDoctors.filter(d => d.id !== id);
    this.pendingCount = this.pendingDoctors.length;
  }
}
