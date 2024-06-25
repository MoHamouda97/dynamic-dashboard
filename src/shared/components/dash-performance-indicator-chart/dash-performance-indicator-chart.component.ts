import { Component, ElementRef, Input, ViewChild, OnChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import * as Chart from "chart.js";
@Component({
  selector: 'app-dash-performance-indicator-chart',
  templateUrl: './dash-performance-indicator-chart.component.html',
  styleUrls: ['./dash-performance-indicator-chart.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DashPerformanceIndicatorChartComponent implements OnChanges {
  @ViewChild("chartEl", { static: true })
  chartEl!: ElementRef;
  chart!: Chart;
  @Input() data: any;
  @Input() options: any;
  @Input() height!: string;

  constructor() {}

  ngOnChanges(changes: any) {
    if (!this.chart) {
      this.chart = new Chart(this.chartEl.nativeElement, {
        type: "line",
        data: this.data,
        options: this.options,
      });
    } else {
      if (changes.data || changes.options) {
        this.chart.data = this.data;
        this.chart.options = this.options;
        this.chart.update();
      }
    }
  }

}
