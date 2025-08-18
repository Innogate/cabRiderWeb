import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlMasterComponent } from './gl-master.component';

describe('GlMasterComponent', () => {
  let component: GlMasterComponent;
  let fixture: ComponentFixture<GlMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
