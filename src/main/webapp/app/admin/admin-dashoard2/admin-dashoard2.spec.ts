import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashoard2 } from './admin-dashoard2';

describe('AdminDashoard2', () => {
  let component: AdminDashoard2;
  let fixture: ComponentFixture<AdminDashoard2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashoard2],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashoard2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
