import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeListMasterComponent } from './charge-list-master.component';

describe('ChargeListMasterComponent', () => {
  let component: ChargeListMasterComponent;
  let fixture: ComponentFixture<ChargeListMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeListMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeListMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
