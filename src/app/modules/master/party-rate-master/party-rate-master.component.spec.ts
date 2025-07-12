import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyRateMasterComponent } from './party-rate-master.component';

describe('PartyRateMasterComponent', () => {
  let component: PartyRateMasterComponent;
  let fixture: ComponentFixture<PartyRateMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyRateMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyRateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
