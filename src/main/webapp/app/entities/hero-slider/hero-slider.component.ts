import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
declare const Swiper: any; // ← only change at the top

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  templateUrl: './hero-slider.component.html',
  imports: [FormsModule, CommonModule, MatButtonModule],
  styleUrls: ['./hero-slider.component.scss'],
})
export class HeroSliderComponent implements AfterViewInit {
  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  currentIndex = 0; // ✅ This tracks the active slide index
  animate = false; // 🔥 to trigger animation

  slides = [
    {
      image: '/images/slide13.png',
      titleStart: 'Find a',
      highlight1: 'Doctor',
      titleMiddle: 'And Book An',
      highlight2: 'Appointment',
      description: `Your health is our priority. Find trusted doctors, book appointments instantly, and choose in-person, home, or online consultations — all from one easy platform.`,
    },
    {
      image: '/images/slide23.png',
      titleStart: 'Track Your',
      highlight1: 'Health',
      titleMiddle: 'And Share',
      highlight2: 'Reports',
      description: `Store all your health records securely and access them anytime.
Easily manage, share, and track your medical journey in one trusted, secure platform.`,
    },
    {
      image: '/images/slide4.png',
      titleStart: 'Consult',
      highlight1: 'Doctor',
      titleMiddle: 'Via Secure',
      highlight2: 'Video Call',
      description: `Connect instantly with certified doctors through high-quality video calls,get real-time medical advice, and prescriptions right from home.`,
    },
  ];

  ngAfterViewInit(): void {
    new Swiper('.swiper-container', {
      loop: true,
      autoplay: { delay: 8000 },
      on: {
        slideChange: (swiper: any) => {
          this.ngZone.run(() => {
            this.currentIndex = swiper.realIndex; // ✅ correct
            console.log('currentIndex:', this.currentIndex);

            this.animate = false;
            setTimeout(() => {
              this.animate = true;
              this.cdr.detectChanges();
            }, 50);
            this.cdr.detectChanges();
          });
        },
      },
    });

    setTimeout(() => (this.animate = true), 100);
  }

  doctorName = '';
  openDropdown: string | null = null;

  selected: any = {
    department: null,
    state: null,
    city: null,
  };

  options = {
    department: [
      { label: 'Cardiology', icon: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' },
      { label: 'Neurology', icon: 'https://cdn-icons-png.flaticon.com/512/2857/2857456.png' },
      { label: 'Orthopedics', icon: 'https://cdn-icons-png.flaticon.com/512/9441/9441793.png' },
      { label: 'Pediatrics', icon: 'https://cdn-icons-png.flaticon.com/512/4322/4322995.png' },
    ],
    state: [
      { label: 'State1', icon: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' },
      { label: 'State2', icon: 'https://cdn-icons-png.flaticon.com/512/2857/2857456.png' },
      { label: 'State3', icon: 'https://cdn-icons-png.flaticon.com/512/9441/9441793.png' },
      { label: 'State4', icon: 'https://cdn-icons-png.flaticon.com/512/4322/4322995.png' },
      { label: 'State1', icon: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' },
      { label: 'State2', icon: 'https://cdn-icons-png.flaticon.com/512/2857/2857456.png' },
      { label: 'State3', icon: 'https://cdn-icons-png.flaticon.com/512/9441/9441793.png' },
      { label: 'State4', icon: 'https://cdn-icons-png.flaticon.com/512/4322/4322995.png' },
    ],
    city: [
      { label: 'City1', icon: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' },
      { label: 'City2', icon: 'https://cdn-icons-png.flaticon.com/512/2857/2857456.png' },
      { label: 'City3', icon: 'https://cdn-icons-png.flaticon.com/512/9441/9441793.png' },
      { label: 'City4', icon: 'https://cdn-icons-png.flaticon.com/512/4322/4322995.png' },
    ],
  };

  toggleDropdown(type: string) {
    this.openDropdown = this.openDropdown === type ? null : type;
  }

  selectOption(type: string, opt: any, event: Event) {
    event.stopPropagation();
    this.selected[type] = opt;
    this.openDropdown = null;
  }

  findNow() {
    console.log('Search:', {
      doctor: this.doctorName,
      department: this.selected.department?.label,
      state: this.selected.state?.label,
      city: this.selected.city?.label,
    });
  }
}
