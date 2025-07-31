import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListMasterComponent } from './user-list-master.component';

describe('UserListMasterComponent', () => {
  let component: UserListMasterComponent;
  let fixture: ComponentFixture<UserListMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
