import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideCalendarDays,
  LucideFolderOpen,
  LucideMail,
  LucideUser,
  LucideSettings,
  LucideFileText,
  LucideLogOut,
  LucideChevronLeft,
  LucideStethoscope,
} from '@lucide/angular';

export interface SidebarNavItem {
  label: string;
  icon: string; // 'calendarDays' | 'folderOpen' | 'mail' | 'user' | 'settings' | 'fileText'
  route: string;
}

@Component({
  selector: 'app-patient-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideCalendarDays,
    LucideFolderOpen,
    LucideMail,
    LucideUser,
    LucideSettings,
    LucideFileText,
    LucideLogOut,
    LucideChevronLeft,
    LucideStethoscope,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  collapsed = signal(false);

  patientName = signal('Amine Ben Ali');
  patientInitial = signal('A');

  mainNav = signal<SidebarNavItem[]>([
    { label: 'Appointments', icon: 'calendarDays', route: '/patient/appointments' },
    { label: 'Medical folder', icon: 'folderOpen', route: '/patient/medical-folder' },
    { label: 'Messages', icon: 'mail', route: '/patient/messages' },
  ]);

  accountNav = signal<SidebarNavItem[]>([
    { label: 'Profile', icon: 'user', route: '/patient/profile' },
    { label: 'Settings', icon: 'settings', route: '/patient/settings' },
    { label: 'Reports & complaints', icon: 'fileText', route: '/patient/reports' },
  ]);

  constructor(private router: Router) {}

  toggleCollapse(): void {
    this.collapsed.update(v => !v);
  }

  logout(): void {
    this.router.navigateByUrl('/login');
  }
}
