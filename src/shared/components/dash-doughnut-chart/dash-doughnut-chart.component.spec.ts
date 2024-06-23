import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashDoughnutChartComponent } from './dash-doughnut-chart.component';

describe('DashDoughnutChartComponent', () => {
  let component: DashDoughnutChartComponent;
  let fixture: ComponentFixture<DashDoughnutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashDoughnutChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashDoughnutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
