import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewVendorInvoiceComponent } from './add-new-vendor-invoice.component';

describe('AddNewVendorInvoiceComponent', () => {
  let component: AddNewVendorInvoiceComponent;
  let fixture: ComponentFixture<AddNewVendorInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewVendorInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewVendorInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
