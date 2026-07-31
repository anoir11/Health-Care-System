import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsBellComponent } from '../patient-notification/notifications-bell.component';
import { Router } from '@angular/router';
import { MessagesBubblesComponent } from '../patient-message-model/messages-bubble.component';
import { PatientService } from 'app/shared/services/patient.service';

@Component({
  selector: 'app-patient-header',
  standalone: true,
  imports: [CommonModule, NotificationsBellComponent, MessagesBubblesComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title = 'MediLink';
  @Input() subtitle = '';
  @Output() menuToggle = new EventEmitter<void>();

  isLoading = signal(true);
  loadError = signal('');
  userName = signal('');

  constructor(
    private patientService: PatientService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.patientService.getMyProfile().subscribe({
      next: res => {
        // this.applyProfileResponse(res);
        this.userName.set(res.firstName);
        this.isLoading.set(false);
      },
      error: err => {
        console.error('Failed to load profile:', err);
        this.loadError.set('Could not load your profile. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  collapsed = signal(false);
  userMenuOpen = signal(false);

  patientName = signal('Amine Ben Ali');
  patientInitial = signal('A');

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  goTo(route: string): void {
    this.userMenuOpen.set(false);
    this.router.navigateByUrl(route);
  }

  logout(): void {
    this.userMenuOpen.set(false);
    // hook up to your auth service, e.g. this.authService.logout();
  }
}
