import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type SlotStatus = 'booked' | 'available' | 'blocked' | 'done' | 'cancelled';
export type AvatarColor = 'green' | 'blue' | 'purple' | 'rose' | 'amber';

export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  color: AvatarColor;
  phone: string;
  reason: string;
  isNew: boolean;
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
}

export interface Slot {
  id: string;
  time: string;
  hour: number;
  minute: number;
  status: SlotStatus;
  patient?: Patient;
  notes?: string;
}

export interface WeekDay {
  date: Date;
  label: string;
  dayShort: string;
  isToday: boolean;
  appointmentCount: number;
}

const MOCK_PATIENTS: Record<string, Patient> = {
  p1: {
    id: 'p1',
    name: 'Amine Ben Ali',
    initials: 'AB',
    age: 28,
    color: 'green',
    phone: '+216 55 123 456',
    reason: 'Cardiology follow-up',
    isNew: false,
    bloodType: 'A+',
    allergies: ['Penicillin', 'Aspirin'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
  },
  p2: {
    id: 'p2',
    name: 'Fatma Trabelsi',
    initials: 'FT',
    age: 45,
    color: 'blue',
    phone: '+216 98 222 333',
    reason: 'First visit · Chest pain',
    isNew: true,
    bloodType: 'O+',
    allergies: [],
    conditions: [],
  },
  p3: {
    id: 'p3',
    name: 'Karim Mansouri',
    initials: 'KM',
    age: 52,
    color: 'purple',
    phone: '+216 71 444 555',
    reason: 'Check-up · Hypertension',
    isNew: false,
    bloodType: 'B+',
    allergies: ['Sulfa'],
    conditions: ['Hypertension'],
  },
  p4: {
    id: 'p4',
    name: 'Sonia Belhaj',
    initials: 'SB',
    age: 38,
    color: 'rose',
    phone: '+216 92 666 777',
    reason: 'Post-surgery follow-up',
    isNew: false,
    bloodType: 'AB-',
    allergies: [],
    conditions: ['Post-cardiac surgery'],
  },
  p5: {
    id: 'p5',
    name: 'Mohamed Sassi',
    initials: 'MS',
    age: 61,
    color: 'amber',
    phone: '+216 55 888 999',
    reason: 'Routine ECG check',
    isNew: false,
    bloodType: 'A-',
    allergies: ['Ibuprofen'],
    conditions: ['Atrial fibrillation'],
  },
};

function generateSlots(date: Date): Slot[] {
  const isToday = date.toDateString() === new Date().toDateString();
  const now = new Date();

  const slotDefs = [
    { time: '08:00', hour: 8, minute: 0, status: 'done' as SlotStatus, patientId: 'p1' },
    { time: '08:30', hour: 8, minute: 30, status: 'available' as SlotStatus },
    { time: '09:00', hour: 9, minute: 0, status: 'done' as SlotStatus, patientId: 'p2' },
    { time: '09:30', hour: 9, minute: 30, status: 'blocked' as SlotStatus, notes: 'Administrative work' },
    { time: '10:00', hour: 10, minute: 0, status: 'booked' as SlotStatus, patientId: 'p3' },
    { time: '10:30', hour: 10, minute: 30, status: 'available' as SlotStatus },
    { time: '11:00', hour: 11, minute: 0, status: 'booked' as SlotStatus, patientId: 'p4' },
    { time: '11:30', hour: 11, minute: 30, status: 'available' as SlotStatus },
    { time: '12:00', hour: 12, minute: 0, status: 'blocked' as SlotStatus, notes: 'Lunch break' },
    { time: '12:30', hour: 12, minute: 30, status: 'blocked' as SlotStatus, notes: 'Lunch break' },
    { time: '13:00', hour: 13, minute: 0, status: 'booked' as SlotStatus, patientId: 'p5' },
    { time: '13:30', hour: 13, minute: 30, status: 'available' as SlotStatus },
    { time: '14:00', hour: 14, minute: 0, status: 'available' as SlotStatus },
    { time: '14:30', hour: 14, minute: 30, status: 'booked' as SlotStatus, patientId: 'p1' },
    { time: '15:00', hour: 15, minute: 0, status: 'available' as SlotStatus },
    { time: '15:30', hour: 15, minute: 30, status: 'available' as SlotStatus },
    { time: '16:00', hour: 16, minute: 0, status: 'cancelled' as SlotStatus, patientId: 'p2' },
    { time: '16:30', hour: 16, minute: 30, status: 'available' as SlotStatus },
  ];

  return slotDefs.map((def, i) => ({
    id: `slot-${i}`,
    time: def.time,
    hour: def.hour,
    minute: def.minute,
    status: def.status,
    patient: def.patientId ? MOCK_PATIENTS[def.patientId] : undefined,
    notes: def.notes,
  }));
}

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.scss'],
})
export class DoctorAppointmentsComponent {
  today = new Date();
  selectedDate = signal<Date>(new Date());
  selectedSlot = signal<Slot | null>(null);
  showBlockModal = signal(false);
  blockNote = signal('');
  activePanel = signal<'details' | 'manage'>('details');

  slots = computed(() => generateSlots(this.selectedDate()));

  weekDays = computed<WeekDay[]>(() => {
    const days: WeekDay[] = [];
    const base = new Date(this.selectedDate());
    const day = base.getDay();
    const monday = new Date(base);
    monday.setDate(base.getDate() - (day === 0 ? 6 : day - 1));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        date: d,
        label: d.getDate().toString(),
        dayShort: d.toLocaleDateString('en-GB', { weekday: 'short' }),
        isToday: d.toDateString() === this.today.toDateString(),
        appointmentCount: i % 3 === 0 ? 0 : Math.floor(Math.random() * 6) + 2,
      });
    }
    return days;
  });

  stats = computed(() => {
    const s = this.slots();
    return {
      total: s.filter(x => x.status === 'booked' || x.status === 'done').length,
      done: s.filter(x => x.status === 'done').length,
      upcoming: s.filter(x => x.status === 'booked').length,
      available: s.filter(x => x.status === 'available').length,
    };
  });

  nextSlot = computed(() => this.slots().find(s => s.status === 'booked') ?? null);

  selectDate(date: Date) {
    this.selectedDate.set(new Date(date));
    this.selectedSlot.set(null);
  }

  prevDay() {
    const d = new Date(this.selectedDate());
    d.setDate(d.getDate() - 1);
    this.selectedDate.set(d);
    this.selectedSlot.set(null);
  }

  nextDay() {
    const d = new Date(this.selectedDate());
    d.setDate(d.getDate() + 1);
    this.selectedDate.set(d);
    this.selectedSlot.set(null);
  }

  goToday() {
    this.selectedDate.set(new Date());
    this.selectedSlot.set(null);
  }

  selectSlot(slot: Slot) {
    if (slot.status === 'available') return;
    this.selectedSlot.set(slot);
    this.activePanel.set('details');
  }

  toggleBlock(slot: Slot) {
    // placeholder — in real app would call API
    console.log('Toggle block:', slot.id);
  }

  confirmBlock() {
    this.showBlockModal.set(false);
    this.blockNote.set('');
  }

  isSelectedDate(date: Date): boolean {
    return date.toDateString() === this.selectedDate().toDateString();
  }

  isToday(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }

  formatSelectedDate(): string {
    return this.selectedDate().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  formatShortDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  statusLabel(status: SlotStatus): string {
    return { booked: 'Upcoming', done: 'Done', available: 'Available', blocked: 'Blocked', cancelled: 'Cancelled' }[status];
  }

  trackById(_: number, s: Slot) {
    return s.id;
  }
  trackByDate(_: number, d: WeekDay) {
    return d.date.toDateString();
  }
}
