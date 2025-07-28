import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceEyesShowComponent } from './invoice-eyes-show.component';

describe('InvoiceEyesShowComponent', () => {
  let component: InvoiceEyesShowComponent;
  let fixture: ComponentFixture<InvoiceEyesShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceEyesShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceEyesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
