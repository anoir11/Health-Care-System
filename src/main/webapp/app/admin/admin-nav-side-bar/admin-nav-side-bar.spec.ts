import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavSideBar } from './admin-nav-side-bar';

describe('AdminNavSideBar', () => {
  let component: AdminNavSideBar;
  let fixture: ComponentFixture<AdminNavSideBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNavSideBar],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNavSideBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
