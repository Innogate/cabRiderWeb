import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotDutyComponent } from './allot-duty.component';

describe('AllotDutyComponent', () => {
  let component: AllotDutyComponent;
  let fixture: ComponentFixture<AllotDutyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotDutyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
