import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPerformanceGaugeComponent } from './dash-performance-gauge.component';

describe('DashPerformanceGaugeComponent', () => {
  let component: DashPerformanceGaugeComponent;
  let fixture: ComponentFixture<DashPerformanceGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashPerformanceGaugeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashPerformanceGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
