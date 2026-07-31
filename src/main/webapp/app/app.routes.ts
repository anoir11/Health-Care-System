import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { VerificationsComponent } from './admin/docRequestVerification/verifications.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout';
import { AdminDashoard2 } from './admin/admin-dashoard2/admin-dashoard2';
import { UsersManagmentComponent } from './admin/admin-users-managment/usersManagment.component';
import { ReportsComponent } from './admin/admin-reports/reports.component';
import { roleGuard } from './guards/role.guard';

import HomeComponent from './home/home.component';
import { SearchResultsComponent } from './entities/search-result/search-results.component';
import { DoctorProfileComponent } from './doctor/doctor-profile/doctor-profile.component';
import { MedicalFolderComponent } from './patient/medical-folder/medical-folder';
import { AppointmentsComponent } from './patient/appointments/appointments.component';
import { ProfileComponent } from './patient/profil/profile.component';
import { MessagesComponent } from './patient/messages/messages.component';
import { MessagesPatientComponent } from './patient/messagePatient/messagesPatient.component';
import { DoctorDashboardComponent } from './doctor/doctor-dashboard/doctor-dashboard.component';
import { DoctorAppointmentsComponent } from './doctor/doctor-appointment/doctor-appointments.component';
import RegisterComponent from './account/register/register.component';
import { DoctorMessagesComponent } from './doctor/doctor-message/doctor-messages.component';
import { MyPatientsComponent } from './doctor/doctor-mypatient/my-patients.component';
import { PrescriptionsComponent } from './doctor/prescription/prescriptions.component';
import LoginComponent from './login/login.component';
import { VerifyEmailComponent } from './entities/verifiy-email/verify-email.component';
import { PatientLayoutComponent } from './patient/patient-layout/patient-layout.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'doctor-profile', component: DoctorProfileComponent },
  { path: 'm', component: MedicalFolderComponent },
  { path: 'm2', component: AppointmentsComponent },
  { path: 'm3', component: ProfileComponent, canActivate: [roleGuard(['PATIENT'])] },
  { path: 'm4', component: MessagesComponent },
  { path: 'm44', component: MessagesPatientComponent },
  { path: 'm5', component: DoctorDashboardComponent },
  { path: 'm6', component: DoctorAppointmentsComponent },
  { path: 'm7', component: MyPatientsComponent },
  { path: 'm8', component: PrescriptionsComponent },
  { path: 'm9', component: DoctorMessagesComponent },
  { path: 'admin-dashboard', component: DashboardComponent },
  { path: 'admin-verification', component: VerificationsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'verify-email', component: VerifyEmailComponent },
  // Admin routes (get BOTH navbars)

  {
    path: 'admin',
    component: AdminLayoutComponent, // ← renders app-admin-navbar + <router-outlet>
    children: [
      { path: 'd1', component: AdminDashoard2 },
      { path: 'd2', component: VerificationsComponent },
      { path: 'd3', component: UsersManagmentComponent },
      { path: 'd4', component: ReportsComponent },
      // all your admin pages go here as children
    ],
  },

  {
    path: 'patient',
    component: PatientLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'medical-folder', component: MedicalFolderComponent },
      { path: 'prescriptions', component: PrescriptionsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'messages', component: MessagesPatientComponent },
    ],
  },
];
