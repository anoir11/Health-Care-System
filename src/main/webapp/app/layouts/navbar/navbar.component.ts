import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { LANGUAGES } from 'app/config/language.constants';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { environment } from 'environments/environment';
import ActiveMenuDirective from './active-menu.directive';
import NavbarItem from './navbar-item.model';

import { CommonModule } from '@angular/common'; // ← add

@Component({
  selector: 'app-navbar',
  standalone: true, // ← add
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, SharedModule, CommonModule, RouterLink],
})
export default class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = signal(true);
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account = inject(AccountService).trackCurrentAccount();
  entitiesNavbarItems: NavbarItem[] = [];

  sidebarOpen = false;
  isSearchPage = false;
  isDoctorProfilePage = false;
  isRegister = false;
  isAdminDashboard = false;
  isDocRequest = false;
  isScrolled = false;
  isTask = false;
  isEmailVerif = false;
  isPatientDashboard = false;
  isTask2 = false;

  private readonly loginService = inject(LoginService);
  private readonly translateService = inject(TranslateService);
  private readonly stateStorageService = inject(StateStorageService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  constructor() {
    const { VERSION } = environment;
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isSearchPage = event.urlAfterRedirects === '/search-result';
        this.isDoctorProfilePage = event.urlAfterRedirects === '/doctor-profile';
        this.isRegister = event.urlAfterRedirects === '/register';
        // this.isAdminDashboard = event.urlAfterRedirects === '/admin-dashboard';
        this.isAdminDashboard = this.router.url.startsWith('/admin');
        this.isPatientDashboard = this.router.url.startsWith('/patient');
        this.isDocRequest = event.urlAfterRedirects === '/admin-verification';
        this.isEmailVerif = event.urlAfterRedirects.startsWith('/verify-email');

        this.isTask = event.urlAfterRedirects.startsWith('/tas');
        this.isTask2 = event.urlAfterRedirects === '/task5';
      }
    });

    // this.entitiesNavbarItems = EntityNavbarItems;
    // this.profileService.getProfileInfo().subscribe(profileInfo => {
    //   this.inProduction = profileInfo.inProduction;
    //   this.openAPIEnabled = profileInfo.openAPIEnabled;
    // });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 100;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // changeLanguage(languageKey: string): void {
  //   this.stateStorageService.storeLocale(languageKey);
  //   this.translateService.use(languageKey);
  // }

  // collapseNavbar(): void {
  //   this.isNavbarCollapsed.set(true);
  // }

  // login(): void {
  //   this.router.navigate(['/login']);
  // }

  // logout(): void {
  //   this.collapseNavbar();
  //   this.loginService.logout();
  //   this.router.navigate(['']);
  // }

  // toggleNavbar(): void {
  //   this.isNavbarCollapsed.update(isNavbarCollapsed => !isNavbarCollapsed);
  // }
}
