import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-doc-home',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule],
  templateUrl: './search-doc-home.component.html',
  styleUrls: ['./search-doc-home.component.scss'],
})
export class SearchDocHomeComponent implements OnInit {
  constructor() {}
  isMobile = false;

  ngOnInit(): void {
    this.checkDevice();
  }

  @HostListener('window:resize')
  checkDevice() {
    this.isMobile = window.innerWidth <= 900; // your $bp-tablet value
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
