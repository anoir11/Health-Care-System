import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

declare const Swiper: any;

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  templateUrl: './hero-slider.component.html',
  imports: [FormsModule, CommonModule, MatButtonModule],
  styleUrls: ['./hero-slider.component.scss'],
})
export class HeroSliderComponent implements AfterViewInit, OnDestroy {
  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  currentIndex = 0; // ✅ tracks the active slide index
  animate = false; // 🔥 triggers the text fade-up animation

  private swiperInstance: any;
  private animateTimeoutId: ReturnType<typeof setTimeout> | undefined;

  slides = [
    {
      image: '../../../content/images/slide13.png',
      titleStart: 'Find a',
      highlight1: 'Doctor',
      titleMiddle: 'And Book An',
      highlight2: 'Appointment',
      description: `Your health is our priority. Find trusted doctors, book appointments instantly, and choose in-person, home, or online consultations — all from one easy platform.`,
    },
    {
      image: '../../../content/images/slide23.png',
      titleStart: 'Track Your',
      highlight1: 'Health',
      titleMiddle: 'And Share',
      highlight2: 'Reports',
      description: `Store all your health records securely and access them anytime.
Easily manage, share, and track your medical journey in one trusted, secure platform.`,
    },
    {
      image: '../../../content/images/slide4.png',
      titleStart: 'Consult',
      highlight1: 'Doctor',
      titleMiddle: 'Via Secure',
      highlight2: 'Video Call',
      description: `Connect instantly with certified doctors through high-quality video calls, get real-time medical advice, and prescriptions right from home.`,
    },
  ];

  ngAfterViewInit(): void {
    this.swiperInstance = new Swiper('.swiper-container', {
      loop: true,
      effect: 'fade', // ✅ crossfade instead of horizontal slide
      fadeEffect: { crossFade: true },
      autoplay: { delay: 8000, disableOnInteraction: false },
      on: {
        slideChange: (swiper: any) => {
          this.ngZone.run(() => {
            this.currentIndex = swiper.realIndex;
            this.animate = false;
            clearTimeout(this.animateTimeoutId);
            this.animateTimeoutId = setTimeout(() => {
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

  ngOnDestroy(): void {
    clearTimeout(this.animateTimeoutId);
    this.swiperInstance?.destroy(true, true); // ✅ prevent leaked/duplicate instances
  }

  /** Lets the dots actually navigate the slider */
  goToSlide(index: number): void {
    this.swiperInstance?.slideToLoop(index);
  }

  trackBySlide(index: number): number {
    return index;
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

  toggleDropdown(type: string, event: Event) {
    event.stopPropagation();
    // Close other dropdowns and toggle this one
    this.openDropdown = this.openDropdown === type ? null : type;
  }

  selectOption(type: string, opt: any, event: Event) {
    event.stopPropagation();
    this.selected[type] = opt;
    this.openDropdown = null;
  }

  /** ✅ Closes any open dropdown when the user clicks outside of it */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.openDropdown && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.openDropdown = null;
    }
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
