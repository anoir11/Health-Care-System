import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled';
export type AppointmentTab = 'upcoming' | 'past' | 'cancelled';

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  clinic: string;
  date: Date;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: AppointmentStatus;
  avatarInitials: string;
  avatarColor: 'blue' | 'teal' | 'purple' | 'rose';
  notes?: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    clinic: 'Clinique du Lac, Tunis',
    date: new Date('2026-05-06'),
    time: '10:30 AM',
    type: 'in-person',
    status: 'confirmed',
    avatarInitials: 'SJ',
    avatarColor: 'blue',
  },
  {
    id: 'a2',
    doctor: 'Dr. Mohamed Karim',
    specialty: 'Radiologist',
    clinic: 'Polyclinique El Menzah',
    date: new Date('2026-05-14'),
    time: '02:00 PM',
    type: 'in-person',
    status: 'pending',
    avatarInitials: 'MK',
    avatarColor: 'teal',
  },
  {
    id: 'a3',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    clinic: 'Clinique du Lac',
    date: new Date('2026-03-05'),
    time: '09:00 AM',
    type: 'in-person',
    status: 'confirmed',
    avatarInitials: 'SJ',
    avatarColor: 'blue',
    notes: 'Follow-up consultation',
  },
  {
    id: 'a4',
    doctor: 'Dr. Leila Mansouri',
    specialty: 'General Practitioner',
    clinic: 'Institut Pasteur',
    date: new Date('2026-02-22'),
    time: '11:00 AM',
    type: 'in-person',
    status: 'confirmed',
    avatarInitials: 'LM',
    avatarColor: 'purple',
    notes: 'Annual checkup',
  },
  {
    id: 'a5',
    doctor: 'Dr. Mohamed Karim',
    specialty: 'Radiologist',
    clinic: 'Polyclinique El Menzah',
    date: new Date('2026-01-10'),
    time: '03:30 PM',
    type: 'in-person',
    status: 'cancelled',
    avatarInitials: 'MK',
    avatarColor: 'teal',
  },
];

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent {
  activeTab = signal<AppointmentTab>('upcoming');
  allAppointments = signal<Appointment[]>(MOCK_APPOINTMENTS);

  today = new Date();

  nextAppointment = computed(
    () =>
      this.allAppointments()
        .filter(a => a.date >= this.today && a.status !== 'cancelled')
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0] ?? null,
  );

  upcomingAppointments = computed(() =>
    this.allAppointments()
      .filter(a => a.date >= this.today && a.status !== 'cancelled')
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
  );

  pastAppointments = computed(() =>
    this.allAppointments()
      .filter(a => a.date < this.today && a.status !== 'cancelled')
      .sort((a, b) => b.date.getTime() - a.date.getTime()),
  );

  cancelledAppointments = computed(() =>
    this.allAppointments()
      .filter(a => a.status === 'cancelled')
      .sort((a, b) => b.date.getTime() - a.date.getTime()),
  );

  tabCounts = computed(() => ({
    upcoming: this.upcomingAppointments().length,
    past: this.pastAppointments().length,
    cancelled: this.cancelledAppointments().length,
  }));

  cancelAppointment(id: string) {
    this.allAppointments.update(appts => appts.map(a => (a.id === id ? { ...a, status: 'cancelled' as AppointmentStatus } : a)));
  }

  bookAgain(appt: Appointment) {
    // navigate to booking flow — placeholder
    console.log('Book again:', appt.doctor);
  }

  formatDay(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: '2-digit' });
  }

  formatMonth(date: Date): string {
    return date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
  }

  formatFullDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  formatShortDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  typeIcon(type: string): string {
    return { 'in-person': '📍', video: '🎥', phone: '📞' }[type] ?? '📍';
  }

  typeLabel(type: string): string {
    return { 'in-person': 'In-person', video: 'Video call', phone: 'Phone call' }[type] ?? type;
  }

  daysUntil(date: Date): number {
    const diff = date.getTime() - this.today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  trackById(_: number, a: Appointment) {
    return a.id;
  }
}
