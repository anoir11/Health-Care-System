import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ReportStatus = 'open' | 'inprogress' | 'resolved' | 'dismissed';
export type ReportSeverity = 'high' | 'medium' | 'low';
export type DoctorAction = 'warn' | 'suspend' | 'ban' | 'none' | '';

export interface LogEntry {
  type: 'open' | 'review' | 'resolve' | 'dismiss' | 'action' | 'reopen';
  text: string;
  time: string;
}

export interface Report {
  id: string;
  // Patient
  patientName: string;
  patientInitials: string;
  patientAvatarBg: string;
  // Doctor
  doctorName: string;
  doctorInitials: string;
  doctorAvatarBg: string;
  doctorSpecialty: string;
  doctorClinic: string;
  // Report meta
  type: string;
  severity: ReportSeverity;
  status: ReportStatus;
  statusLabel: string;
  description: string;
  additionalContext?: string;
  submittedAt: string;
  assignedTo?: string;
  // Appointment
  appointmentDate?: string;
  appointmentType?: string;
  // Log
  log: LogEntry[];
}

export interface StatusFilter {
  label: string;
  value: string;
  count: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  // ── State ──────────────────────────────────────────────────────────────────
  searchQuery = '';
  statusFilter = 'all';
  severityFilter = 'all';
  sortBy = 'newest';
  resolutionNote = '';
  selectedAction: DoctorAction = '';
  isProcessing = false;

  selectedReport: Report | null = null;

  // ── Counts ─────────────────────────────────────────────────────────────────
  get openCount() {
    return this.allReports.filter(r => r.status === 'open').length;
  }
  get inProgressCount() {
    return this.allReports.filter(r => r.status === 'inprogress').length;
  }
  get resolvedCount() {
    return this.allReports.filter(r => r.status === 'resolved').length;
  }
  get dismissedCount() {
    return this.allReports.filter(r => r.status === 'dismissed').length;
  }

  statusFilters: StatusFilter[] = [];

  // ── Data ───────────────────────────────────────────────────────────────────
  allReports: Report[] = [
    {
      id: '1',
      patientName: 'Tarek Hammami',
      patientInitials: 'TH',
      patientAvatarBg: '#f59e0b',
      doctorName: 'Malek Zouari',
      doctorInitials: 'MZ',
      doctorAvatarBg: '#3b82f6',
      doctorSpecialty: 'Neurology',
      doctorClinic: 'Clinique Hannibal',
      type: 'Unprofessional conduct',
      severity: 'high',
      status: 'open',
      statusLabel: 'Open',
      description:
        'The doctor was rude and dismissive during the consultation. He cut me off multiple times and refused to answer my questions about my diagnosis. I left the appointment feeling worse than when I arrived.',
      additionalContext: 'This is the second complaint filed against this doctor in 3 months.',
      submittedAt: 'May 5, 2026 · 09:42',
      appointmentDate: 'May 4, 2026 · 14:00',
      appointmentType: 'In-person consultation',
      log: [{ type: 'open', text: 'Report filed by Tarek Hammami', time: 'May 5 · 09:42' }],
    },
    {
      id: '2',
      patientName: 'Sonia Mbarki',
      patientInitials: 'SM',
      patientAvatarBg: '#ec4899',
      doctorName: 'Riadh Ghariani',
      doctorInitials: 'RG',
      doctorAvatarBg: '#10b981',
      doctorSpecialty: 'General medicine',
      doctorClinic: 'Cabinet Privé Tunis',
      type: 'Incorrect prescription',
      severity: 'high',
      status: 'inprogress',
      statusLabel: 'In review',
      description:
        'I was prescribed a medication that I am known to be allergic to. My allergy was clearly documented in my patient profile. This caused a severe allergic reaction requiring emergency care.',
      submittedAt: 'May 3, 2026 · 16:20',
      assignedTo: 'Sami Amara',
      appointmentDate: 'May 2, 2026 · 10:30',
      appointmentType: 'Video consultation',
      log: [
        { type: 'open', text: 'Report filed by Sonia Mbarki', time: 'May 3 · 16:20' },
        { type: 'review', text: 'Assigned to Sami Amara for review', time: 'May 3 · 17:05' },
        { type: 'action', text: 'Doctor contacted for statement', time: 'May 4 · 09:15' },
      ],
    },
    {
      id: '3',
      patientName: 'Walid Bejaoui',
      patientInitials: 'WB',
      patientAvatarBg: '#8b5cf6',
      doctorName: 'Khaled Mhamdi',
      doctorInitials: 'KM',
      doctorAvatarBg: '#f97316',
      doctorSpecialty: 'Orthopedics',
      doctorClinic: 'Clinique El Amen',
      type: 'No-show consultation',
      severity: 'medium',
      status: 'open',
      statusLabel: 'Open',
      description:
        'Doctor did not show up for our scheduled video consultation. I waited 45 minutes with no notification or explanation. This is the second time this has happened.',
      submittedAt: 'May 4, 2026 · 11:10',
      appointmentDate: 'May 4, 2026 · 09:00',
      appointmentType: 'Video consultation',
      log: [{ type: 'open', text: 'Report filed by Walid Bejaoui', time: 'May 4 · 11:10' }],
    },
    {
      id: '4',
      patientName: 'Ines Souissi',
      patientInitials: 'IS',
      patientAvatarBg: '#14b8a6',
      doctorName: 'Ali Sassi',
      doctorInitials: 'AS',
      doctorAvatarBg: '#64748b',
      doctorSpecialty: 'Dermatology',
      doctorClinic: 'Polyclinique Tunis',
      type: 'Privacy violation',
      severity: 'high',
      status: 'resolved',
      statusLabel: 'Resolved',
      description:
        'The doctor shared my personal health information with a third party without my consent. I found out through a mutual acquaintance who mentioned details that could only have come from my medical file.',
      submittedAt: 'Apr 28, 2026 · 14:55',
      assignedTo: 'Sami Amara',
      appointmentDate: 'Apr 25, 2026 · 15:30',
      appointmentType: 'In-person consultation',
      log: [
        { type: 'open', text: 'Report filed by Ines Souissi', time: 'Apr 28 · 14:55' },
        { type: 'review', text: 'Assigned to Sami Amara', time: 'Apr 28 · 15:30' },
        { type: 'action', text: 'Doctor suspended pending investigation', time: 'Apr 29 · 10:00' },
        { type: 'resolve', text: 'Resolved — doctor account permanently banned', time: 'May 1 · 09:20' },
      ],
    },
    {
      id: '5',
      patientName: 'Karim Tlili',
      patientInitials: 'KT',
      patientAvatarBg: '#3b82f6',
      doctorName: 'Nour Sfaxi',
      doctorInitials: 'NS',
      doctorAvatarBg: '#a78bfa',
      doctorSpecialty: 'Cardiology',
      doctorClinic: 'Clinique du Lac',
      type: 'Overcharging',
      severity: 'medium',
      status: 'dismissed',
      statusLabel: 'Dismissed',
      description:
        'I was charged significantly more than the quoted consultation fee with no explanation. The invoice did not match what I was told at booking.',
      submittedAt: 'Apr 22, 2026 · 08:30',
      appointmentDate: 'Apr 21, 2026 · 11:00',
      appointmentType: 'In-person consultation',
      log: [
        { type: 'open', text: 'Report filed by Karim Tlili', time: 'Apr 22 · 08:30' },
        { type: 'review', text: 'Reviewed by admin', time: 'Apr 22 · 12:00' },
        { type: 'dismiss', text: 'Dismissed — price discrepancy explained by clinic billing policy', time: 'Apr 23 · 09:45' },
      ],
    },
    {
      id: '6',
      patientName: 'Rania Hamdi',
      patientInitials: 'RH',
      patientAvatarBg: '#ef4444',
      doctorName: 'Malek Zouari',
      doctorInitials: 'MZ',
      doctorAvatarBg: '#3b82f6',
      doctorSpecialty: 'Neurology',
      doctorClinic: 'Clinique Hannibal',
      type: 'Unprofessional conduct',
      severity: 'medium',
      status: 'open',
      statusLabel: 'Open',
      description:
        'During my appointment the doctor made several inappropriate comments about my weight and lifestyle. I felt humiliated and did not feel comfortable continuing the consultation.',
      submittedAt: 'May 5, 2026 · 13:30',
      appointmentDate: 'May 5, 2026 · 10:00',
      appointmentType: 'In-person consultation',
      log: [{ type: 'open', text: 'Report filed by Rania Hamdi', time: 'May 5 · 13:30' }],
    },
  ];

  filteredReports: Report[] = [];

  ngOnInit(): void {
    this.applyFilters();
  }

  setStatusFilter(value: string): void {
    this.statusFilter = value;
    this.applyFilters();
  }

  applyFilters(): void {
    let res = [...this.allReports];

    if (this.statusFilter !== 'all') {
      res = res.filter(r => r.status === this.statusFilter);
    }
    if (this.severityFilter !== 'all') {
      res = res.filter(r => r.severity === this.severityFilter);
    }

    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      res = res.filter(
        r =>
          r.patientName.toLowerCase().includes(q) ||
          r.doctorName.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      );
    }

    if (this.sortBy === 'oldest') res = res.reverse();
    if (this.sortBy === 'severity') {
      const order: Record<ReportSeverity, number> = { high: 0, medium: 1, low: 2 };
      res = res.sort((a, b) => order[a.severity] - order[b.severity]);
    }

    this.filteredReports = res;
    this.updateStatusFilters();
  }

  updateStatusFilters(): void {
    this.statusFilters = [
      { label: 'All', value: 'all', count: this.allReports.length },
      { label: 'Open', value: 'open', count: this.openCount },
      { label: 'In review', value: 'inprogress', count: this.inProgressCount },
      { label: 'Resolved', value: 'resolved', count: this.resolvedCount },
      { label: 'Dismissed', value: 'dismissed', count: this.dismissedCount },
    ];
  }

  selectReport(r: Report): void {
    this.selectedReport = r;
    this.resolutionNote = '';
    this.selectedAction = '';
  }

  closePanel(): void {
    this.selectedReport = null;
  }

  // ── Quick actions (from card) ───────────────────────────────────────────────
  markInProgress(r: Report): void {
    r.status = 'inprogress';
    r.statusLabel = 'In review';
    r.log.push({ type: 'review', text: 'Marked in review by admin', time: 'Just now' });
    this.applyFilters();
  }

  quickResolve(r: Report): void {
    r.status = 'resolved';
    r.statusLabel = 'Resolved';
    r.log.push({ type: 'resolve', text: 'Marked as resolved by admin', time: 'Just now' });
    this.applyFilters();
    if (this.selectedReport?.id === r.id) this.selectedReport = { ...r };
  }

  quickDismiss(r: Report): void {
    r.status = 'dismissed';
    r.statusLabel = 'Dismissed';
    r.log.push({ type: 'dismiss', text: 'Dismissed by admin', time: 'Just now' });
    this.applyFilters();
    if (this.selectedReport?.id === r.id) this.selectedReport = { ...r };
  }

  reopenReport(r: Report): void {
    r.status = 'open';
    r.statusLabel = 'Open';
    r.log.push({ type: 'reopen', text: 'Reopened by admin', time: 'Just now' });
    this.applyFilters();
    if (this.selectedReport?.id === r.id) this.selectedReport = { ...r };
  }

  // ── Full resolve from detail panel ─────────────────────────────────────────
  resolveReport(r: Report): void {
    this.isProcessing = true;

    setTimeout(() => {
      if (this.selectedAction && this.selectedAction !== 'none') {
        const actionText: Record<string, string> = {
          warn: 'Warning issued to doctor',
          suspend: 'Doctor account suspended',
          ban: 'Doctor permanently banned',
        };
        r.log.push({
          type: 'action',
          text: actionText[this.selectedAction] || '',
          time: 'Just now',
        });
      }

      if (this.resolutionNote.trim()) {
        r.log.push({
          type: 'resolve',
          text: `Resolution note: "${this.resolutionNote.trim()}"`,
          time: 'Just now',
        });
      }

      r.log.push({ type: 'resolve', text: 'Report marked as resolved', time: 'Just now' });
      r.status = 'resolved';
      r.statusLabel = 'Resolved';

      this.isProcessing = false;
      this.resolutionNote = '';
      this.selectedAction = '';
      this.selectedReport = { ...r };
      this.applyFilters();
    }, 800);
  }

  trackById(_: number, r: Report): string {
    return r.id;
  }
}
