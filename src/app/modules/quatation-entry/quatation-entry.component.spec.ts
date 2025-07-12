import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuatationEntryComponent } from './quatation-entry.component';

describe('QuatationEntryComponent', () => {
  let component: QuatationEntryComponent;
  let fixture: ComponentFixture<QuatationEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuatationEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuatationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
