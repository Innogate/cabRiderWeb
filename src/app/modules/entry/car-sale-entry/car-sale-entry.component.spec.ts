import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarSaleEntryComponent } from './car-sale-entry.component';

describe('CarSaleEntryComponent', () => {
  let component: CarSaleEntryComponent;
  let fixture: ComponentFixture<CarSaleEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarSaleEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarSaleEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
