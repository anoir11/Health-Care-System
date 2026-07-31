import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavSideBar } from '../admin-nav-side-bar/admin-nav-side-bar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: 'admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  today = new Date();
  pendingCount = 7;
  openReports = 3;
}
