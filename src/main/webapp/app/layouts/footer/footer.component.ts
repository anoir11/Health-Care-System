import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './safe-html.pipe';

@Component({
  selector: 'jhi-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe], // replaces the NgModule declarations
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export default class FooterComponent {
  email = '';
  currentYear = new Date().getFullYear();

  stats = [
    { value: '48K+', label: 'Patients served' },
    { value: '1,200', label: 'Certified doctors' },
    { value: '4.9★', label: 'Average rating' },
  ];

  linkColumns = [
    {
      title: 'Services',
      links: [
        { label: 'Book appointment', href: '#', badge: null, badgeColor: '' },
        { label: 'Find specialist', href: '#', badge: null, badgeColor: '' },
        { label: 'Video consult', href: '#', badge: 'New', badgeColor: 'green' },
        { label: 'Lab results', href: '#', badge: null, badgeColor: '' },
        { label: 'Prescriptions', href: '#', badge: null, badgeColor: '' },
        { label: 'Health records', href: '#', badge: null, badgeColor: '' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About MediLink', href: '#', badge: null, badgeColor: '' },
        { label: 'Our doctors', href: '#', badge: null, badgeColor: '' },
        { label: 'Clinics & hospitals', href: '#', badge: null, badgeColor: '' },
        { label: 'Health blog', href: '#', badge: null, badgeColor: '' },
        { label: 'Press', href: '#', badge: null, badgeColor: '' },
        { label: 'Careers', href: '#', badge: 'Hiring', badgeColor: 'blue' },
      ],
    },
    {
      title: 'Support & Urgent',
      links: [
        { label: 'Help center', href: '#', badge: null, badgeColor: '' },
        { label: 'Patient guide', href: '#', badge: null, badgeColor: '' },
        { label: 'Insurance & billing', href: '#', badge: null, badgeColor: '' },
        { label: '24h nurse hotline', href: '#', badge: 'Live', badgeColor: 'green' },
        { label: 'Emergency locator', href: '#', badge: null, badgeColor: '' },
        { label: 'Contact us', href: '#', badge: null, badgeColor: '' },
      ],
    },
  ];

  trustItems = [
    {
      label: 'HIPAA Compliant',
      sub: 'Fully certified',
      color: 'g',
      svgPath: `<path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2z" stroke="#00c88c" stroke-width="1.5"/>
                <path d="M9 12l2 2 4-4" stroke="#00c88c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      label: '256-bit SSL',
      sub: 'End-to-end encrypted',
      color: 'b',
      svgPath: `<rect x="3" y="11" width="18" height="11" rx="2" stroke="#5599ff" stroke-width="1.5"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="#5599ff" stroke-width="1.5" stroke-linecap="round"/>`,
    },
    {
      label: 'Board-certified doctors',
      sub: 'All verified',
      color: 'g',
      svgPath: `<circle cx="12" cy="8" r="4" stroke="#00c88c" stroke-width="1.5"/>
                <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#00c88c" stroke-width="1.5" stroke-linecap="round"/>`,
    },
    {
      label: '24 / 7 Available',
      sub: 'Always here',
      color: 'b',
      svgPath: `<path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="#5599ff" stroke-width="1.5"/>
                <path d="M12 6v6l4 2" stroke="#5599ff" stroke-width="1.5" stroke-linecap="round"/>`,
    },
  ];

  socials = [
    {
      label: 'Facebook',
      href: '#',
      svgPath: `<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" fill="rgba(255,255,255,0.4)"/>`,
    },
    {
      label: 'Twitter',
      href: '#',
      svgPath: `<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" fill="rgba(255,255,255,0.4)"/>`,
    },
    {
      label: 'LinkedIn',
      href: '#',
      svgPath: `<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" fill="rgba(255,255,255,0.4)"/><circle cx="4" cy="4" r="2" fill="rgba(255,255,255,0.4)"/>`,
    },
    {
      label: 'Instagram',
      href: '#',
      svgPath: `<rect x="2" y="2" width="20" height="20" rx="5" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none"/>
                <circle cx="12" cy="12" r="4" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none"/>
                <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.4)"/>`,
    },
  ];

  legalLinks = [
    { label: 'Privacy policy', href: '#' },
    { label: 'Terms of service', href: '#' },
    { label: 'Cookies', href: '#' },
    { label: 'Accessibility', href: '#' },
  ];

  onBookAppointment(): void {
    // Navigate to booking page, e.g.: this.router.navigate(['/book'])
    console.log('Navigate to booking');
  }

  onSubscribe(): void {
    if (!this.email) return;
    // Call your newsletter service here
    console.log('Subscribed:', this.email);
    this.email = '';
  }
}
