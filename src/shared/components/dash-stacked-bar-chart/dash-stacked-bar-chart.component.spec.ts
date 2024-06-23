import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashStackedBarChartComponent } from './dash-stacked-bar-chart.component';

describe('DashStackedBarChartComponent', () => {
  let component: DashStackedBarChartComponent;
  let fixture: ComponentFixture<DashStackedBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashStackedBarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashStackedBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
