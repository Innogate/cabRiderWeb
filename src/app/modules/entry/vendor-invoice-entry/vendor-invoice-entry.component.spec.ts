import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInvoiceEntryComponent } from './vendor-invoice-entry.component';

describe('VendorInvoiceEntryComponent', () => {
  let component: VendorInvoiceEntryComponent;
  let fixture: ComponentFixture<VendorInvoiceEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorInvoiceEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorInvoiceEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
