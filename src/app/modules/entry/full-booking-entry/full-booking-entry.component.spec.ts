import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullBookingEntryComponent } from './full-booking-entry.component';

describe('FullBookingEntryComponent', () => {
  let component: FullBookingEntryComponent;
  let fixture: ComponentFixture<FullBookingEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullBookingEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullBookingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
