import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningbillEntryComponent } from './openingbill-entry.component';

describe('OpeningbillEntryComponent', () => {
  let component: OpeningbillEntryComponent;
  let fixture: ComponentFixture<OpeningbillEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeningbillEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningbillEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
