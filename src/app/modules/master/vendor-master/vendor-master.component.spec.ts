import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMasterComponent } from './vendor-master.component';

describe('VendorMasterComponent', () => {
  let component: VendorMasterComponent;
  let fixture: ComponentFixture<VendorMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
