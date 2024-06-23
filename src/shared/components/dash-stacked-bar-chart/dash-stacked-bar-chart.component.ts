import { Component, ElementRef, Inject, Input, ViewChild, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
//import { TranslateModule } from "@ngx-translate/core";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { DashStatusLegendComponent } from "../dash-status-legend/dash-status-legend.component";
import * as Chart from "chart.js";
import { strToArray } from "src/shared/utils";

const backgroundBar: any = {
  id: "backgroundBar",
  beforeDatasetDraw(chart: any, _args: any, options: any) {
    const {
      ctx,
      data,
      chartArea: { top, width, height },
      scales: { x },
    } = chart;

    ctx.save();

    if (!data.labels?.length) return;

    const segment = width / (data.labels.length ?? 1);
    const barPercentage = data.datasets?.[0]?.barPercentage ?? 0.9;
    const categoryPercentage = data.datasets?.[0]?.categoryPercentage ?? 0.8;
    const barWidth = segment * barPercentage * categoryPercentage;
    const styles = getComputedStyle(document.documentElement);
    const colors = data.datasets[0].backgroundColor as string[];
    const isPercentage = options["isPercentage"];

    ctx.font = `1rem bold ${styles.getPropertyValue("--font-family")}`;
    ctx.textAlign = "center";

    for (let i = 0; i < data.labels.length; i++) {
      if (isPercentage) {
        ctx.fillStyle = styles.getPropertyValue("--surface-border");
        ctx.fillRect(
          x.getPixelForValue(i) - barWidth / 2,
          top,
          barWidth,
          height
        );
      }
      ctx.fillStyle = colors[i] ?? styles.getPropertyValue("--text-color");
      const sum = data.datasets.reduce((acc: any, item: any) => {
        const count = (item.data[i] as number) || 0;
        return acc + count;
      }, 0);
      ctx.fillText(
        data.datasets[data.datasets.length - 1].data[i]?.toString()
          ? `${sum.toString()}${isPercentage ? "%" : ""}`
          : "",
        x.getPixelForValue(i),
        isPercentage
          ? top - 10
          : chart.getDatasetMeta(data.datasets.length - 1).data[i].y - 10
      );
    }
  },
};

@Component({
  selector: 'app-dash-stacked-bar-chart',
  templateUrl: './dash-stacked-bar-chart.component.html',
  styleUrls: ['./dash-stacked-bar-chart.component.css'],
  standalone: true,
  imports: [
    DashStatusLegendComponent
  ],
})
export class DashStackedBarChartComponent implements OnInit {
  @ViewChild('chartEl') chartEl!: ElementRef;
  @ViewChild('container') containerEl!: ElementRef;

  @Input() dbId!: number;
  @Input() data: any[] = [];
  @Input() action: any;
  @Input() labels: any[] = [];
  @Input() xlabels: any[] = [];
  @Input() showTotal: boolean = true;
  @Input() isPercentage: boolean = false;
  @Input() hideTooltip: boolean = false;
  @Input() formatNumbers: boolean = false;
  @Input() title!: string;
  @Input() loading: boolean = false;
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];

  chart: any;
  chartData: any;
  options: any;

  constructor() {}

  ngOnInit() {
    this.initializeChart();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  initializeChart() {
    this.chartData = {
      labels: this.xlabels,
      datasets: this.data.map(item => ({
        label: item.label,
        data: item.count,
        backgroundColor: item.color,
        barPercentage: 0.4,
        categoryPercentage: 0.95,
      })),
    };

    this.options = {
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          bottom: 10,
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            minRotation: 0,
            maxRotation: 0,
            callback: (tickValue: any) => {
              // return strToArray(
              //   this.getLabelForValue(tickValue as number),
              //   10,
              //   2
              // );
            },
          },
        },
        y: {
          display: false,
          stacked: true,
          beginAtZero: true,
          max: this.isPercentage ? 100 : undefined,
          grid: {
            offset: true,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        backgroundBar: {
          isPercentage: this.isPercentage,
        },
        datalabels: {
          color: "#ffffff",
          textAlign: "center",
          formatter: (value: any, context: any) => {
            if (!value) return "";
            const isPercentage = context.chart.options.plugins?.backgroundBar?.isPercentage;
            return `${value}${isPercentage ? "%" : ""}`;
          },
        },
        tooltip: {
          enabled: !this.hideTooltip,
          mode: "index",
          intersect: false,
          usePointStyle: true,
          callbacks: {
            title: (tooltipItems: any) => {
              return strToArray(tooltipItems[0].label, 35);
            },
            label: (tooltipItem: any) =>{
              const isPercentage = this.chart.options.plugins?.backgroundBar?.isPercentage;
              return ` ${tooltipItem.formattedValue}${isPercentage ? "%" : ""}`;
            },
          },
        },
      },
    };

    if (this.action) {
      this.options.onClick = (e: any) => {
        const element = this.chart.getElementsAtEventForMode(
          e.native as Event,
          "nearest",
          { intersect: true },
          true
        )?.[0];
        const _filters = [
          {
            PropertyKey: this.action.query.StackLookupProperty,
            PropertyValue: this.data[element.datasetIndex].key,
          },
        ];
        let _componentFilters: any[] = [];

        if (!this.action.query.XAxisComponent) {
          _filters.push({
            PropertyKey: this.action.query.XAxisLookupProperty,
            PropertyValue: this.data[element.datasetIndex].dataKeys[element.index],
          });
        } else {
          _componentFilters = [
            {
              ModuleType: "Component",
              ModuleId: this.data[element.datasetIndex].dataKeys[element.index],
            },
          ];
        }

        this.openDialog(
          [..._filters, ...this.propertyFilters],
          [..._componentFilters, ...this.componentFilters]
        );
      };
      this.options.onHover = (event: any, chartElement: any) => {
        if (event.native?.target) {
          event.native.target.style.cursor = chartElement[0]
            ? "pointer"
            : "default";
        }
      };
    }
  }

  createChart() {
    if (this.chartEl) {
      this.chart = new Chart(this.chartEl.nativeElement, {
        type: "bar",
        plugins: [backgroundBar, ChartDataLabels],
        data: this.chartData,
        options: this.options,
      });
    }
  }

  openDialog(filters?: any[], componentFilters?: any[]) {
    // this.dialogRef = this.dialogService.open(TableModalComponent, {
    //   header: this.title,
    //   data: {
    //     dbId: this.dbId,
    //     action: this.action,
    //     filters,
    //     componentFilters,
    //   },
    //   contentStyle: {
    //     height: "80vh",
    //   },
    //   styleClass: "modal-lg",
    // });
  }

}
