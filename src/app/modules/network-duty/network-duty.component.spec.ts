import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDutyComponent } from './network-duty.component';

describe('NetworkDutyComponent', () => {
  let component: NetworkDutyComponent;
  let fixture: ComponentFixture<NetworkDutyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkDutyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
