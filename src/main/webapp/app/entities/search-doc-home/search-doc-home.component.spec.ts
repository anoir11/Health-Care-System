import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDocHomeComponent } from './search-doc-home.component';

describe('SearchDocHomeComponent', () => {
  let component: SearchDocHomeComponent;
  let fixture: ComponentFixture<SearchDocHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchDocHomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDocHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
