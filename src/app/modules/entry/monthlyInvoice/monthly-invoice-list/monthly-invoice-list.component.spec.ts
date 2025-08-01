import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyInvoiceListComponent } from './monthly-invoice-list.component';

describe('MonthlyInvoiceListComponent', () => {
  let component: MonthlyInvoiceListComponent;
  let fixture: ComponentFixture<MonthlyInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyInvoiceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
