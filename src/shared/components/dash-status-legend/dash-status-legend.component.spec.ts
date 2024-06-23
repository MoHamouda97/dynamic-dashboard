import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashStatusLegendComponent } from './dash-status-legend.component';

describe('DashStatusLegendComponent', () => {
  let component: DashStatusLegendComponent;
  let fixture: ComponentFixture<DashStatusLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashStatusLegendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashStatusLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
