import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, ViewChild, OnChanges, SimpleChanges } from "@angular/core";
import * as Chart from "chart.js";


@Component({
  selector: "app-performance-indicator-chart",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./performance-indicator-chart.component.html",
  styleUrls: ["./performance-indicator-chart.component.scss"],
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
