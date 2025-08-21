import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSaleComponent } from './general-sale.component';

describe('GeneralSaleComponent', () => {
  let component: GeneralSaleComponent;
  let fixture: ComponentFixture<GeneralSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
