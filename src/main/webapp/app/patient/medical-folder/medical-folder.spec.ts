import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalFolder } from './medical-folder';

describe('MedicalFolder', () => {
  let component: MedicalFolder;
  let fixture: ComponentFixture<MedicalFolder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalFolder],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalFolder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
