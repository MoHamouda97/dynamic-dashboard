import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashUserAvatarComponent } from './dash-user-avatar.component';

describe('DashUserAvatarComponent', () => {
  let component: DashUserAvatarComponent;
  let fixture: ComponentFixture<DashUserAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashUserAvatarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashUserAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
