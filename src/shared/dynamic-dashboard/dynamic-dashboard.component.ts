import { Component, OnInit } from '@angular/core';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';

@Component({
  selector: 'app-dynamic-dashboard',
  templateUrl: './dynamic-dashboard.component.html',
  styleUrls: ['./dynamic-dashboard.component.css'],
  standalone: true,
  imports: [
    BarChartComponent
  ]
})
export class DynamicDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
