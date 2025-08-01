import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyInvoiceCreateComponent } from './monthly-invoice-create.component';

describe('MonthlyInvoiceCreateComponent', () => {
  let component: MonthlyInvoiceCreateComponent;
  let fixture: ComponentFixture<MonthlyInvoiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyInvoiceCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyInvoiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
