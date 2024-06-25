import {
  Component,
  ElementRef,
  Inject,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
} from "@angular/core";
import * as Chart from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { DashStatusLegendComponent } from "../dash-status-legend/dash-status-legend.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-dash-doughnut-chart',
  templateUrl: './dash-doughnut-chart.component.html',
  styleUrls: ['./dash-doughnut-chart.component.css'],
  host: {
    class: "w-full",
  },
  providers: [],
  standalone: true,
  imports: [
    CommonModule,
    DashStatusLegendComponent,
  ]
})
export class DashDoughnutChartComponent implements OnInit {
  @ViewChild("chartEl") chartEl: any;
  
  @Input() dbId!: number;
  @Input() data!: any[];
  @Input() action: any;
  @Input() showTotal: boolean = true;
  @Input() showHeader: boolean = false;
  @Input() showLegends: boolean = true;
  @Input() hideTooltip: boolean = false;
  @Input() empty: boolean = false;
  @Input() legends!: any[];
  @Input() title!: string;
  @Input() loading: boolean = false;
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];

  chart: any;
  centerPosition: any;
  dialogRef: any;

  ngOnInit(): void {
    // Initialization logic here if needed
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  get chartData() {
    const labels: string[] = [];
    const data: number[] = [];
    const colors: string[] = [];
    this.data?.forEach((item) => {
      labels.push(item.label);
      data.push(item.count);
      colors.push(item.color);
    });
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderRadius: 5,
        },
      ],
    };
  }

  get totalCount() {
    return (
      this.chartData?.datasets?.[0]?.data?.reduce(
        (acc: number, item: number) => acc + item,
        0
      ) ?? 0
    );
  }

  get options(): any {
    const _options: any = {
      cutout: "60%",
      plugins: {
        legend: {
          display: false,
          position: "bottom",
          onClick: () => {},
          labels: {
            pointStyle: "rectRounded",
            usePointStyle: true,
          },
        },
        datalabels: {
          display: true,
          textAlign: "center",
          color: "#ffffff",
          font: {
            weight: "bold",
          },
          formatter: function (value: any) {
            return value || null;
          },
        },
        tooltip: {
          enabled: !this.hideTooltip,
          usePointStyle: true,
        },
      },
    };

    if (this.action) {
      _options.onClick = (e: any) => {
        const element = this.chart.getElementsAtEventForMode(
          e.native as Event,
          "nearest",
          { intersect: true },
          true
        )?.[0];
        this.openDialog([
          {
            PropertyKey: this.action.query.PivotProperty,
            PropertyValue: this.data?.[element.index].key,
          },
          ...this.propertyFilters,
        ]);
      };
      _options.onHover = (event: any, chartElement: any) => {
        if (event.native?.target) {
          event.native.target.style.cursor = chartElement[0]
            ? "pointer"
            : "default";
        }
      };
    }

    return _options;
  }

  createChart() {
    if (this.chartEl) {
      this.chart = new Chart(this.chartEl.nativeElement, {
        plugins: [ChartDataLabels as any],
        type: "doughnut",
        data: this.chartData,
        options: this.options,
      });
      this.centerPosition = {
        x: this.chart.getDatasetMeta(0).data[0].x,
        y: this.chart.getDatasetMeta(0).data[0].y,
      };
    }
  }

  openDialog(filters?: any) {
    // this.dialogRef = this.dialogService.open(TableModalComponent, {
    //   header: this.title,
    //   data: {
    //     dbId: this.dbId,
    //     action: this.action,
    //     filters,
    //     componentFilters: this.componentFilters,
    //   },
    //   contentStyle: {
    //     height: "80vh",
    //   },
    //   styleClass: "modal-lg",
    // });
  }

}
