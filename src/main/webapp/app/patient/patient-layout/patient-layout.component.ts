import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './patient-layout.component.html',
  styleUrls: ['./patient-layout.component.scss'],
})
export class PatientLayoutComponent {
  mobileNavOpen = signal(false);
  pageTitle = signal('Dashboard');
  pageSubtitle = signal('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // Reads `data: { title, subtitle }` off the deepest active route.
    // Set these in your route config, e.g.:
    // { path: 'appointments', component: AppointmentsComponent,
    //   data: { title: 'Appointments', subtitle: 'Manage your upcoming and past visits' } }
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => {
          let child = this.route.firstChild;
          while (child?.firstChild) child = child.firstChild;
          return child?.snapshot.data ?? {};
        }),
      )
      .subscribe(data => {
        this.pageTitle.set(data['title'] ?? 'Dashboard');
        this.pageSubtitle.set(data['subtitle'] ?? '');
      });
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update(v => !v);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }
}
