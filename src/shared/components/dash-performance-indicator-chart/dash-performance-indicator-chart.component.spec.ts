import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPerformanceIndicatorChartComponent } from './dash-performance-indicator-chart.component';

describe('DashPerformanceIndicatorChartComponent', () => {
  let component: DashPerformanceIndicatorChartComponent;
  let fixture: ComponentFixture<DashPerformanceIndicatorChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashPerformanceIndicatorChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashPerformanceIndicatorChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
