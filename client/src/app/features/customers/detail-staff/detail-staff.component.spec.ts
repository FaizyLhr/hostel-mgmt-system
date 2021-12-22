import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStaffComponent } from './detail-staff.component';

describe('DetailStaffComponent', () => {
  let component: DetailStaffComponent;
  let fixture: ComponentFixture<DetailStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
