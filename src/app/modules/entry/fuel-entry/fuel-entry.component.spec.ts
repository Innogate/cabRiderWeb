import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelEntryComponent } from './fuel-entry.component';

describe('FuelEntryComponent', () => {
  let component: FuelEntryComponent;
  let fixture: ComponentFixture<FuelEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
