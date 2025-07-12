import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSalarySetupMasterComponent } from './driver-salary-setup-master.component';

describe('DriverSalarySetupMasterComponent', () => {
  let component: DriverSalarySetupMasterComponent;
  let fixture: ComponentFixture<DriverSalarySetupMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverSalarySetupMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverSalarySetupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
