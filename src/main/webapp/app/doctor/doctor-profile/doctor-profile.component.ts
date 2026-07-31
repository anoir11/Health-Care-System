import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

// ── Interfaces ─────────────────────────────────────────────────────
export interface Doctor {
  id: string;
  name: string;
  initials: string;
  photo?: string;
  specialty: string;
  subspecialty: string;
  bio: string;
  quote?: string;
  price: number;
  rating: number;
  reviewCount: number;
  satisfaction: number;
  experience: number;
  patientCount: number;
  clinic: string;
  clinicAddress: string;
  distance: number;
  city: string;
  languages: string[];
  languageDetails: LanguageDetail[];
  expertise: string[];
  education: Education[];
  clinicHours: ClinicHour[];
  isVerified: boolean;
  isTopRated: boolean;
  topRatedYear?: number;
  availableToday: boolean;
  offersOnlineConsult: boolean;
  isOnline: boolean;
}

export interface LanguageDetail {
  name: string;
  flag: string;
  level: string;
  proficiency: number; // 1–5
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface ClinicHour {
  day: string;
  time: string;
  isToday: boolean;
  closed: boolean;
}

export interface SlotDay {
  label: string;
  sublabel: string;
  slots: Slot[];
}

export interface Slot {
  id: string;
  time: string;
  taken: boolean;
}

export interface Review {
  name: string;
  initials: string;
  avatarColor: string;
  date: string;
  rating: number;
  text: string;
  tag: string;
}

export interface RatingBar {
  stars: number;
  count: number;
  pct: number;
}

export interface SimilarDoctor {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  price: number;
  rating: number;
  avatarColor: string;
}

// ── Component ──────────────────────────────────────────────────────
@Component({
  selector: 'app-doctor-profile',
  imports: [RouterLink, CommonModule],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.scss'],
})
export class DoctorProfileComponent implements OnInit {
  // ── Doctor data ──────────────────────────────────────────────
  doctor: Doctor = {
    id: '1',
    name: 'Dr. Sarah Johnson',
    initials: 'SJ',
    specialty: 'Cardiologist',
    subspecialty: 'Interventional Cardiology',
    bio: 'Dr. Sarah Johnson is a board-certified cardiologist with 14 years of experience in interventional cardiology and advanced cardiac imaging. After completing her residency at CHU Tunis, she pursued a fellowship at Hôpital Lariboisière in Paris. She specializes in complex coronary interventions, echocardiography, and preventive cardiology — known for combining rigorous diagnostic skills with a warm, patient-first approach.',
    quote:
      'My goal is not just to treat the condition, but to understand the patient — their history, their lifestyle, their concerns — and build a care plan that truly fits their life.',
    price: 80,
    rating: 4.9,
    reviewCount: 312,
    satisfaction: 98,
    experience: 14,
    patientCount: 847,
    clinic: 'Clinique du Lac',
    clinicAddress: 'Les Berges du Lac, 1053 Tunis',
    distance: 1.2,
    city: 'Tunis',
    languages: ['AR', 'FR', 'EN'],
    languageDetails: [
      { name: 'Arabic', flag: '🇹🇳', level: 'Native', proficiency: 5 },
      { name: 'French', flag: '🇫🇷', level: 'Fluent', proficiency: 4 },
      { name: 'English', flag: '🇬🇧', level: 'Professional', proficiency: 3 },
    ],
    expertise: [
      'ECG',
      'Echocardiography',
      'Coronary angiography',
      'Stent placement',
      'Holter monitor',
      'Stress test',
      'Heart failure',
      'Arrhythmia',
      'Preventive cardiology',
    ],
    education: [
      { degree: 'MD — Medicine', institution: 'Faculté de Médecine de Tunis', year: 2005 },
      { degree: 'Residency — Cardiology', institution: 'CHU La Rabta, Tunis', year: 2010 },
      { degree: 'Fellowship — Interventional Cardiology', institution: 'Hôpital Lariboisière, Paris', year: 2012 },
    ],
    clinicHours: [
      { day: 'Thursday (today)', time: '9:00 – 18:00', isToday: true, closed: false },
      { day: 'Friday', time: '9:00 – 17:00', isToday: false, closed: false },
      { day: 'Saturday', time: '9:00 – 13:00', isToday: false, closed: false },
      { day: 'Sunday', time: '', isToday: false, closed: true },
    ],
    isVerified: true,
    isTopRated: true,
    topRatedYear: 2024,
    availableToday: true,
    offersOnlineConsult: true,
    isOnline: true,
  };

  // ── UI state ─────────────────────────────────────────────────
  activeTab = 'overview';
  consultType = 'in-person';
  selectedSlot = 'thu-1000';
  activeReviewFilter = 'All (312)';

  // ── Booking slots ─────────────────────────────────────────────
  availableDays: SlotDay[] = [
    {
      label: 'Thu 19 March',
      sublabel: 'Today',
      slots: [
        { id: 'thu-1000', time: '10:00', taken: false },
        { id: 'thu-1130', time: '11:30', taken: false },
        { id: 'thu-1300', time: '13:00', taken: true },
        { id: 'thu-1430', time: '14:30', taken: false },
        { id: 'thu-1600', time: '16:00', taken: false },
        { id: 'thu-1730', time: '17:30', taken: true },
      ],
    },
    {
      label: 'Fri 20 March',
      sublabel: 'Tomorrow',
      slots: [
        { id: 'fri-0900', time: '09:00', taken: false },
        { id: 'fri-1030', time: '10:30', taken: false },
        { id: 'fri-1400', time: '14:00', taken: false },
      ],
    },
  ];

  // ── Reviews ───────────────────────────────────────────────────
  reviewFilters = ['All (312)', 'Echocardiography', 'ECG', 'Follow-up', 'First visit'];

  private allReviews: Review[] = [
    {
      name: 'Ahmed M.',
      initials: 'AM',
      avatarColor: '#185FA5',
      date: 'March 2025',
      rating: 5,
      text: 'Dr. Johnson is exceptionally thorough and kind. She took the time to explain everything clearly. Diagnosis was accurate, treatment worked perfectly.',
      tag: 'Echocardiography',
    },
    {
      name: 'Fatma B.',
      initials: 'FB',
      avatarColor: '#0F6E56',
      date: 'February 2025',
      rating: 5,
      text: 'Very professional. Short wait, spotless clinic, and she made me feel completely at ease. Will keep coming back.',
      tag: 'Follow-up',
    },
    {
      name: 'Karim T.',
      initials: 'KT',
      avatarColor: '#92400e',
      date: 'January 2025',
      rating: 5,
      text: "Best cardiologist I've seen. Clear explanations, modern equipment, and she genuinely cares about outcomes.",
      tag: 'ECG',
    },
  ];

  filteredReviews: Review[] = [...this.allReviews];

  ratingBars: RatingBar[] = [
    { stars: 5, count: 272, pct: 88 },
    { stars: 4, count: 31, pct: 10 },
    { stars: 3, count: 6, pct: 2 },
    { stars: 2, count: 2, pct: 1 },
    { stars: 1, count: 1, pct: 0 },
  ];

  // ── Similar doctors ───────────────────────────────────────────
  similarDoctors: SimilarDoctor[] = [
    {
      id: '2',
      name: 'Dr. Mohamed Karim',
      initials: 'MK',
      specialty: 'Interventional Cardiologist',
      price: 100,
      rating: 4.8,
      avatarColor: '#185FA5',
    },
    {
      id: '3',
      name: 'Dr. Leila Ben Salah',
      initials: 'LB',
      specialty: 'Pediatric Cardiologist',
      price: 60,
      rating: 4.6,
      avatarColor: '#0F6E56',
    },
    { id: '4', name: 'Dr. Amine Trabelsi', initials: 'AT', specialty: 'Cardiologist', price: 70, rating: 4.7, avatarColor: '#854F0B' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Replace mock data with real service call:
    // const id = this.route.snapshot.paramMap.get('id');
    // this.doctorService.getById(id).subscribe(doc => this.doctor = doc);
  }

  // ── Methods ───────────────────────────────────────────────────
  setTab(tab: string): void {
    this.activeTab = tab;
    const el = document.getElementById(tab);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToBooking(): void {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  }

  contactDoctor(): void {
    // Navigate to contact / messaging
  }

  selectSlot(id: string): void {
    this.selectedSlot = id;
  }

  confirmBooking(): void {
    if (!this.selectedSlot) return;
    // this.router.navigate(['/booking'], {
    //   queryParams: { doctor: this.doctor.id, slot: this.selectedSlot, type: this.consultType }
    // });
  }

  filterReviews(filter: string): void {
    this.activeReviewFilter = filter;
    this.filteredReviews = filter.startsWith('All') ? [...this.allReviews] : this.allReviews.filter(r => r.tag === filter);
  }
}
