import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSplitChartComponent } from './dash-split-chart.component';

describe('DashSplitChartComponent', () => {
  let component: DashSplitChartComponent;
  let fixture: ComponentFixture<DashSplitChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashSplitChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashSplitChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
