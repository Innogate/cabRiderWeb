import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbillingComponent } from './mbilling.component';

describe('MbillingComponent', () => {
  let component: MbillingComponent;
  let fixture: ComponentFixture<MbillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MbillingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
