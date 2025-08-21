import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarSaleComponent } from './car-sale.component';

describe('CarSaleComponent', () => {
  let component: CarSaleComponent;
  let fixture: ComponentFixture<CarSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
