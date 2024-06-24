import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesBarCardComponent } from './properties-bar-card.component';

describe('PropertiesBarCardComponent', () => {
  let component: PropertiesBarCardComponent;
  let fixture: ComponentFixture<PropertiesBarCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesBarCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesBarCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
