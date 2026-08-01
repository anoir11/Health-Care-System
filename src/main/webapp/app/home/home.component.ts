import { Component, OnDestroy, OnInit, inject, signal, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate } from '@angular/animations';
import { initDecoCanvas, initDecoCanvas2, initDecoCanvas3 } from './deco-canvas.util';
import { CommonModule } from '@angular/common';
import { SearchDocHomeComponent } from 'app/entities/search-doc-home/search-doc-home.component';
import { ChatComponent } from 'app/entities/chat/chat.component';
import { HeroSliderComponent } from 'app/entities/hero-slider/hero-slider.component';
import { FooterComponent } from 'app/layouts/footer/footer.component';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  imports: [HeroSliderComponent, CommonModule, FooterComponent, SearchDocHomeComponent, ChatComponent],
  styleUrl: './home.component.scss',
  animations: [
    trigger('contentAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),

    trigger('imageAnimation', [
      transition(
        '* => *',
        [
          style({
            opacity: 0,
            transform: 'translate({{x}}, {{y}})',
          }),
          animate(
            '{{duration}} ease-out',
            style({
              opacity: 1,
              transform: 'translate(0, 0)',
            }),
          ),
        ],
        { params: { x: '0px', y: '0px', duration: '300ms' } },
      ),
    ]),

    trigger('textAnimation', [
      transition(
        '* => *',
        [
          style({
            opacity: 0,
            transform: 'translate({{x}}, {{y}})',
          }),
          animate(
            '{{duration}} ease-out',
            style({
              opacity: 1,
              transform: 'translate(0, 0)',
            }),
          ),
        ],
        { params: { x: '0px', y: '20px', duration: '400ms' } },
      ),
    ]),
  ],
})
export default class HomeComponent implements OnInit {
  isMobile = false;

  ngOnInit(): void {
    this.checkDevice();
  }

  @HostListener('window:resize')
  checkDevice() {
    this.isMobile = window.innerWidth <= 900; // your $bp-tablet value
  }

  ngAfterViewInit() {
    initDecoCanvas();
    initDecoCanvas2();
    initDecoCanvas3();
  }

  value: number | null = null;
  options = [
    { label: 'None', value: null },
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
    { label: 'Three', value: 3 },
  ];
  trackOption(index: number, option: any): any {
    return option.value;
  }

  // Menu list with their content
  menus = [
    {
      label: 'Find Doctor',
      icon: '<i class="fa-solid fa-user-doctor"></i>',
      title: 'How do you find the right doctor ?',
      content:
        'The service allows patients to search for qualified doctors by location and specialty, helping them choose the most suitable healthcare professional.',
      note1: 'Search by location',
      note2: 'Filter by specialty',
      note3: 'View doctor profiles',
      note4: 'Check availability',
      image: 'https://smilepure.thememove.com/wp-content/uploads/2019/06/h1-doctor.png',
    },
    {
      label: 'Appointments',
      icon: '<i class="fa-solid fa-calendar-days"></i>',
      title: 'How does online appointment booking work?',
      content:
        'The system enables patients to book medical appointments online by selecting a doctor, choosing an available time, and confirming instantly.',
      note1: 'Real-time scheduling',
      note2: 'Private doctor calendar',
      note3: 'Instant confirmation',
      note4: 'Easy rescheduling',
      image: 'https://savaclinic.com/wp-content/uploads/2024/06/Sava-Clinic-Services-1.png',
    },
    {
      label: 'Medical Files',
      icon: '<i class="fa-solid fa-file-medical"></i>',
      title: 'How are medical records stored safely?',
      content:
        'The platform allows users to upload medical documents securely, making them accessible only to authorized doctors involved in their care.',
      note1: 'Secure uploads',
      note2: 'Doctor-only access',
      note3: 'Centralized records',
      note4: 'Data privacy',
      image: 'https://duocpham10.adsmoweb.com/assets/img/home-three/1.png',
    },
    {
      label: 'Doctor Profile',
      icon: '<i class="fa-solid fa-user-gear"></i>',
      title: 'What information can patients see?',
      content:
        'Each doctor has a public profile displaying qualifications, specialties, and experience to help patients make informed decisions.',
      note1: 'Professional details',
      note2: 'Specialties listed',
      note3: 'Experience overview',
      note4: 'Public visibility',
      image: '/images/doctor-profile.png',
    },
    {
      label: 'Notifications',
      icon: '<i class="fa-solid fa-bell"></i>',
      title: 'How do appointment notifications help?',
      content:
        'The notification system keeps patients and doctors informed about upcoming appointments, changes, and important medical updates.',
      note1: 'Appointment reminders',
      note2: 'Schedule changes',
      note3: 'Instant alerts',
      note4: 'Email and app notifications',
      image: '/images/notifications.png',
    },
  ];

  // Default selected menu
  selectedMenuIndex = 0;

  // Method to select a menu
  selectMenu(index: number) {
    this.selectedMenuIndex = index;
  }

  getImageAnim() {
    const animations = [
      { x: '-40px', y: '0px', duration: '350ms' }, // Find Doctor
      { x: '40px', y: '0px', duration: '350ms' }, // Appointments
      { x: '0px', y: '-40px', duration: '400ms' }, // Medical Files
      { x: '0px', y: '40px', duration: '400ms' }, // Doctor Profile
      { x: '-60px', y: '0px', duration: '450ms' }, // Notifications
    ];
    return animations[this.selectedMenuIndex];
  }

  getTextAnim() {
    const animations = [
      { x: '0px', y: '30px', duration: '450ms' },
      { x: '0px', y: '20px', duration: '400ms' },
      { x: '0px', y: '40px', duration: '500ms' },
      { x: '0px', y: '25px', duration: '450ms' },
      { x: '0px', y: '35px', duration: '500ms' },
    ];
    return animations[this.selectedMenuIndex];
  }

  moveLeft() {
    const carouselContent = document.querySelector('.carousalContainer') as HTMLElement;
    carouselContent.scrollLeft -= 505; // Move left by one card width (300px) + 20px gap
  }

  moveRight() {
    const carouselContent = document.querySelector('.carousalContainer') as HTMLElement;
    carouselContent.scrollLeft += 505; // Move right by one card width (300px) + 20px gap
  }

  chatOpen = false;

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  activeStep = 0;

  steps: Step[] = [
    {
      step: 'Step 01 — Find',
      title: 'Find the right doctor',
      desc: 'Search qualified doctors by location and specialty. Filter and view verified profiles to choose confidently.',
      feats: ['By location', 'Specialty filter', 'Verified doctors'],
      bg: '#FEF2F2',
      accent: '#EF4444',
      featColor: '#991b1b',
      featBorder: '#fca5a5',
      centerBg: '#EF4444',
      label: 'Find Doctor',
    },
    {
      step: 'Step 02 — Book',
      title: 'Book in seconds',
      desc: 'Pick your preferred time slot and confirm instantly. Automated reminders keep you on track.',
      feats: ['Pick date', 'Instant confirm', 'Reminders'],
      bg: '#EFF6FF',
      accent: '#3B82F6',
      featColor: '#1e40af',
      featBorder: '#bfdbfe',
      centerBg: '#3B82F6',
      label: 'Appointments',
    },
    {
      step: 'Step 03 — Files',
      title: 'Manage medical files',
      desc: 'Upload, store and share your health records securely with doctors anytime, from anywhere.',
      feats: ['Secure storage', 'Easy sharing', 'Track tests'],
      bg: '#F5F3FF',
      accent: '#8B5CF6',
      featColor: '#5b21b6',
      featBorder: '#ddd6fe',
      centerBg: '#8B5CF6',
      label: 'Medical Files',
    },
    {
      step: 'Step 04 — Alerts',
      title: 'Stay updated always',
      desc: 'Real-time notifications for appointments, lab results, prescriptions and personalised health tips.',
      feats: ['Lab results', 'Reminders', 'Health tips'],
      bg: '#FFFBEB',
      accent: '#F59E0B',
      featColor: '#92400e',
      featBorder: '#fde68a',
      centerBg: '#F59E0B',
      label: 'Notifications',
    },
  ];

  get currentStep(): Step {
    return this.steps[this.activeStep];
  }

  select(index: number): void {
    this.activeStep = index;
  }
}

interface Step {
  step: string;
  title: string;
  desc: string;
  feats: string[];
  bg: string;
  accent: string;
  featColor: string;
  featBorder: string;
  centerBg: string;
  label: string;
}
