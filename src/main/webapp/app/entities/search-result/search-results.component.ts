import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Doctor {
  id: number;
  name: string;
  initials: string;
  specialty: string;
  clinic: string;
  experience: number;
  patientCount: number;
  rating: number;
  reviewCount: number;
  price: number;
  tags: string[];
  verified: boolean;
  avatarBg: string;
  photo?: string;
}

export interface FilterOption {
  label: string;
  count: number;
  checked: boolean;
  key: string;
}

export interface FilterGroup {
  title: string;
  options: FilterOption[];
}

export interface QuickFilter {
  label: string;
  active: boolean;
  key: string;
}

@Component({
  selector: 'app-search-results',
  imports: [FormsModule, CommonModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  // ── Search form state ──────────────────────────────────────────
  searchForm = {
    doctorName: '',
    specialty: 'Cardiology',
    state: 'Tunisia',
    city: 'Tunis',
  };

  specialties = ['Cardiology', 'Dentistry', 'Neurology', 'Pediatrics', 'Dermatology', 'Orthopedics', 'General Practice'];
  states = ['Tunisia', 'France', 'Algeria'];
  cities = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte'];

  // ── Filters ────────────────────────────────────────────────────
  priceMin: number | null = null;
  priceMax: number | null = null;

  quickFilters: QuickFilter[] = [
    { label: 'All', active: true, key: 'all' },
    { label: 'Online only', active: false, key: 'online' },
    { label: 'Top rated', active: false, key: 'top_rated' },
    { label: 'Home visit', active: false, key: 'home_visit' },
    { label: 'Available now', active: false, key: 'available_now' },
  ];

  filterGroups: FilterGroup[] = [
    {
      title: 'Availability',
      options: [
        { label: 'Available today', count: 24, checked: true, key: 'avail_today' },
        { label: 'This week', count: 61, checked: false, key: 'avail_week' },
        { label: 'Online consult', count: 18, checked: false, key: 'avail_online' },
      ],
    },
    {
      title: 'Consultation type',
      options: [
        { label: 'In-person', count: 42, checked: true, key: 'type_inperson' },
        { label: 'Home visit', count: 11, checked: false, key: 'type_home' },
        { label: 'Video call', count: 29, checked: false, key: 'type_video' },
      ],
    },
    {
      title: 'Rating',
      options: [
        { label: '4.5 and above', count: 16, checked: true, key: 'rating_45' },
        { label: '4.0 and above', count: 35, checked: false, key: 'rating_40' },
        { label: '3.5 and above', count: 47, checked: false, key: 'rating_35' },
      ],
    },
    {
      title: 'Experience',
      options: [
        { label: '1–5 years', count: 20, checked: false, key: 'exp_1_5' },
        { label: '5–10 years', count: 28, checked: false, key: 'exp_5_10' },
        { label: '10+ years', count: 17, checked: true, key: 'exp_10_plus' },
      ],
    },
  ];

  // ── Sorting & view ─────────────────────────────────────────────
  sortBy = 'match';
  viewMode: 'list' | 'map' = 'list';

  // ── Pagination ─────────────────────────────────────────────────
  currentPage = 1;
  pageSize = 6;
  totalResults = 47;

  get totalPages(): number {
    return Math.ceil(this.filteredDoctors.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // ── Doctors data ───────────────────────────────────────────────
  allDoctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      initials: 'SJ',
      specialty: 'Cardiologist',
      clinic: 'Clinique du Lac, Tunis',
      experience: 14,
      patientCount: 847,
      rating: 4.9,
      reviewCount: 312,
      price: 80,
      tags: ['Available today', 'ECG', 'Echocardiography', 'Heart surgery'],
      verified: true,
      avatarBg: '#dbeafe',
    },
    {
      id: 2,
      name: 'Dr. Mohamed Karim',
      initials: 'MK',
      specialty: 'Interventional Cardiologist',
      clinic: 'Polyclinique El Menzah',
      experience: 11,
      patientCount: 523,
      rating: 4.8,
      reviewCount: 208,
      price: 100,
      tags: ['Available today', 'Angioplasty', 'Stent placement', 'Online consult'],
      verified: true,
      avatarBg: '#fef3c7',
    },
    {
      id: 3,
      name: 'Dr. Leila Ben Salah',
      initials: 'LB',
      specialty: 'Pediatric Cardiologist',
      clinic: 'Hôpital Charles Nicolle',
      experience: 8,
      patientCount: 390,
      rating: 4.6,
      reviewCount: 145,
      price: 60,
      tags: ['Next: tomorrow', 'Pediatric echo', 'Congenital defects'],
      verified: false,
      avatarBg: '#dcfce7',
    },
    {
      id: 4,
      name: 'Dr. Youssef Trabelsi',
      initials: 'YT',
      specialty: 'Cardiac Electrophysiologist',
      clinic: 'Centre Médical Ibn Sina',
      experience: 16,
      patientCount: 1024,
      rating: 4.7,
      reviewCount: 289,
      price: 120,
      tags: ['Available today', 'Pacemaker', 'Arrhythmia', 'Online consult'],
      verified: true,
      avatarBg: '#fce7f3',
    },
    {
      id: 5,
      name: 'Dr. Amina Chaabane',
      initials: 'AC',
      specialty: 'Cardiologist',
      clinic: 'Clinique Hannibal',
      experience: 9,
      patientCount: 445,
      rating: 4.5,
      reviewCount: 178,
      price: 70,
      tags: ['Available today', 'ECG', 'Heart failure', 'Home visit'],
      verified: true,
      avatarBg: '#ede9fe',
    },
    {
      id: 6,
      name: 'Dr. Khaled Mansouri',
      initials: 'KM',
      specialty: 'Cardiovascular Surgeon',
      clinic: 'Hôpital Habib Thameur',
      experience: 20,
      patientCount: 1350,
      rating: 4.9,
      reviewCount: 421,
      price: 150,
      tags: ['Next: tomorrow', 'Bypass surgery', 'Valve repair'],
      verified: true,
      avatarBg: '#fee2e2',
    },
  ];

  filteredDoctors: Doctor[] = [];
  isMobile = false;
  // ── Lifecycle ──────────────────────────────────────────────────
  ngOnInit(): void {
    this.filteredDoctors = [...this.allDoctors];
    this.sortDoctors();
    this.checkDevice();
  }

  @HostListener('window:resize')
  checkDevice() {
    this.isMobile = window.innerWidth <= 900; // your $bp-tablet value
  }

  // ── Methods ────────────────────────────────────────────────────
  onSearch(): void {
    // Integrate with your actual search service here
    this.filteredDoctors = [...this.allDoctors];
    this.sortDoctors();
  }

  toggleQuickFilter(pill: QuickFilter): void {
    this.quickFilters.forEach(p => (p.active = false));
    pill.active = true;
    // Apply filter logic based on pill.key
    this.applyAllFilters();
  }

  toggleFilter(opt: FilterOption): void {
    opt.checked = !opt.checked;
    this.applyAllFilters();
  }

  applyPriceFilter(): void {
    this.applyAllFilters();
  }

  applyAllFilters(): void {
    let result = [...this.allDoctors];

    // Price filter
    if (this.priceMin !== null) {
      result = result.filter(d => d.price >= (this.priceMin ?? 0));
    }
    if (this.priceMax !== null) {
      result = result.filter(d => d.price <= (this.priceMax ?? 9999));
    }

    // Rating filter
    const ratingOpts = this.filterGroups.find(g => g.title === 'Rating')?.options ?? [];
    const checkedRating = ratingOpts.find(o => o.checked);
    if (checkedRating) {
      const minRating = checkedRating.key === 'rating_45' ? 4.5 : checkedRating.key === 'rating_40' ? 4.0 : 3.5;
      result = result.filter(d => d.rating >= minRating);
    }

    // Experience filter
    const expOpts = this.filterGroups.find(g => g.title === 'Experience')?.options ?? [];
    const checkedExp = expOpts.filter(o => o.checked);
    if (checkedExp.length > 0) {
      result = result.filter(d => {
        return checkedExp.some(e => {
          if (e.key === 'exp_1_5') return d.experience >= 1 && d.experience < 5;
          if (e.key === 'exp_5_10') return d.experience >= 5 && d.experience < 10;
          if (e.key === 'exp_10_plus') return d.experience >= 10;
          return true;
        });
      });
    }

    this.filteredDoctors = result;
    this.sortDoctors();
  }

  clearFilters(): void {
    this.filterGroups.forEach(g => g.options.forEach(o => (o.checked = false)));
    this.quickFilters.forEach(p => (p.active = false));
    this.quickFilters[0].active = true;
    this.priceMin = null;
    this.priceMax = null;
    this.filteredDoctors = [...this.allDoctors];
  }

  sortDoctors(): void {
    const docs = [...this.filteredDoctors];
    switch (this.sortBy) {
      case 'rating':
        docs.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        docs.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        docs.sort((a, b) => b.price - a.price);
        break;
      case 'experience':
        docs.sort((a, b) => b.experience - a.experience);
        break;
    }
    this.filteredDoctors = docs;
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push('full');
      else if (rating >= i - 0.5) stars.push('half');
      else stars.push('empty');
    }
    return stars;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onBookAppointment(doc: Doctor): void {
    // Navigate to booking page
    console.log('Book appointment for:', doc.name);
  }

  onViewProfile(doc: Doctor): void {
    // Navigate to doctor profile
    console.log('View profile:', doc.name);
  }

  sidebarOpen = true;
  toggleSidebar() {
    if (this.isMobile) {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }

  isOpen = false;

  // Form fields
  searchQuery = '';
  specialty = 'Cardiology';
  governorate = 'Tunisia';
  city = 'Tunis';

  governorates = [
    'Tunis',
    'Ariana',
    'Ben Arous',
    'Manouba',
    'Nabeul',
    'Zaghouan',
    'Bizerte',
    'Béja',
    'Jendouba',
    'Kef',
    'Siliana',
    'Sousse',
    'Monastir',
    'Mahdia',
    'Sfax',
    'Gafsa',
    'Tozeur',
    'Kébili',
    'Gabès',
    'Medenine',
    'Tataouine',
  ];

  openSearch(): void {
    this.isOpen = true;
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  closeSearch(): void {
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  doSearch(): void {
    console.log({
      query: this.searchQuery,
      specialty: this.specialty,
      governorate: this.governorate,
      city: this.city,
    });
    this.closeSearch();
    // → dispatch your search action / navigate here
  }
}
