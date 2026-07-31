import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SlotStatus = 'booked-done' | 'booked-upcoming' | 'available' | 'blocked';
export type AvatarColor = 'green' | 'blue' | 'purple' | 'rose' | 'amber';

export interface TimeSlot {
  id: string;
  time: string;
  status: SlotStatus;
  patient?: {
    name: string;
    initials: string;
    age?: number;
    reason: string;
    avatarColor: AvatarColor;
    isNew?: boolean;
  };
  blockReason?: string;
}

export interface RecentPatient {
  id: string;
  name: string;
  initials: string;
  avatarColor: AvatarColor;
  lastVisit: string;
  reason: string;
}

export interface MessagePreview {
  id: string;
  patientName: string;
  initials: string;
  avatarColor: AvatarColor;
  preview: string;
  time: string;
  unread: number;
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss'],
})
export class DoctorDashboardComponent {
  currentDate = signal(new Date());
  currentDateOffset = signal(0);

  displayDate = computed(() => {
    const d = new Date(this.currentDate());
    d.setDate(d.getDate() + this.currentDateOffset());
    return d;
  });

  isToday = computed(() => this.currentDateOffset() === 0);

  formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  prevDay() {
    this.currentDateOffset.update(v => v - 1);
  }
  nextDay() {
    this.currentDateOffset.update(v => v + 1);
  }
  goToday() {
    this.currentDateOffset.set(0);
  }

  stats = signal({
    todayAppointments: 8,
    remaining: 3,
    totalPatients: 124,
    newThisWeek: 3,
    prescriptions: 37,
    unreadMessages: 5,
  });

  timeSlots = signal<TimeSlot[]>([
    {
      id: 's1',
      time: '08:30',
      status: 'booked-done',
      patient: { name: 'Amine Ben Ali', initials: 'AB', age: 28, reason: 'Follow-up · Cardiology', avatarColor: 'green' },
    },
    { id: 's2', time: '09:00', status: 'available' },
    {
      id: 's3',
      time: '09:30',
      status: 'booked-done',
      patient: { name: 'Fatma Trabelsi', initials: 'FT', age: 52, reason: 'First visit · Chest pain', avatarColor: 'blue', isNew: true },
    },
    { id: 's4', time: '10:00', status: 'blocked', blockReason: 'Break' },
    {
      id: 's5',
      time: '10:30',
      status: 'booked-upcoming',
      patient: { name: 'Karim Mansouri', initials: 'KM', age: 45, reason: 'Check-up · Hypertension', avatarColor: 'purple' },
    },
    { id: 's6', time: '11:00', status: 'available' },
    {
      id: 's7',
      time: '11:30',
      status: 'booked-upcoming',
      patient: { name: 'Sonia Belhaj', initials: 'SB', age: 34, reason: 'Follow-up · Post-surgery', avatarColor: 'rose' },
    },
    { id: 's8', time: '12:00', status: 'blocked', blockReason: 'Lunch break' },
    { id: 's9', time: '14:00', status: 'available' },
    {
      id: 's10',
      time: '14:30',
      status: 'booked-upcoming',
      patient: { name: 'Mohamed Gharbi', initials: 'MG', age: 61, reason: 'Consultation · Arrhythmia', avatarColor: 'amber' },
    },
    { id: 's11', time: '15:00', status: 'available' },
    { id: 's12', time: '15:30', status: 'available' },
  ]);

  nextAppointment = computed(() => this.timeSlots().find(s => s.status === 'booked-upcoming') ?? null);

  recentPatients = signal<RecentPatient[]>([
    { id: 'p1', name: 'Amine Ben Ali', initials: 'AB', avatarColor: 'green', lastVisit: 'Today', reason: 'Cardiology follow-up' },
    { id: 'p2', name: 'Fatma Trabelsi', initials: 'FT', avatarColor: 'blue', lastVisit: 'Today', reason: 'First visit' },
    { id: 'p3', name: 'Karim Mansouri', initials: 'KM', avatarColor: 'purple', lastVisit: '28 Apr', reason: 'Hypertension' },
    { id: 'p4', name: 'Sonia Belhaj', initials: 'SB', avatarColor: 'rose', lastVisit: '25 Apr', reason: 'Post-surgery' },
  ]);

  messages = signal<MessagePreview[]>([
    {
      id: 'm1',
      patientName: 'Amine Ben Ali',
      initials: 'AB',
      avatarColor: 'green',
      preview: 'Doctor, I have a question about my medication…',
      time: '10:12',
      unread: 2,
    },
    {
      id: 'm2',
      patientName: 'Fatma Trabelsi',
      initials: 'FT',
      avatarColor: 'blue',
      preview: 'Thank you for the prescription!',
      time: '09:44',
      unread: 1,
    },
    {
      id: 'm3',
      patientName: 'Karim Mansouri',
      initials: 'KM',
      avatarColor: 'purple',
      preview: 'See you at 10:30!',
      time: 'Yesterday',
      unread: 0,
    },
  ]);

  minutesUntilNext = computed(() => {
    const next = this.nextAppointment();
    if (!next) return null;
    const [h, m] = next.time.split(':').map(Number);
    const now = new Date();
    const diff = h * 60 + m - (now.getHours() * 60 + now.getMinutes());
    return diff > 0 ? diff : null;
  });

  trackById(_: number, item: { id: string }) {
    return item.id;
  }
}
