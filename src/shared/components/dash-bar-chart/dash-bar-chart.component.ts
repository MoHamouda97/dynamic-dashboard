import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOptions } from 'chart.js';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { nFormatter, strToArray } from 'src/shared/utils';
import * as Chart from 'chart.js';
import { DashStatusLegendComponent } from '../dash-status-legend/dash-status-legend.component';


const backgroundBar: any = {
  id: 'backgroundBar',
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
    const isPercentage = options['isPercentage'];
    const formatNumbers = options['formatNumbers'];
    const lang = options['lang'];

    ctx.font = `1rem bold ${styles.getPropertyValue('--font-family')}`;
    ctx.textAlign = 'center';

    for (let i = 0; i < data.labels.length; i++) {
      if (isPercentage) {
        ctx.fillStyle = styles.getPropertyValue('--surface-border');
        ctx.fillRect(
          x.getPixelForValue(i) - barWidth / 2,
          top,
          barWidth,
          height
        );
      }
      ctx.fillStyle = colors[i] ?? styles.getPropertyValue('--text-color');
      let text = '';
      if (data.datasets[0].data[i]?.toString()) {
        text = formatNumbers
          ? nFormatter(
              data.datasets[0].data[i] as number,
              2,
              lang ?? 'en'
            ).toString()
          : (data.datasets[0].data[i]?.toString() as string);
      }
      ctx.fillText(
        `${text}${isPercentage ? '%' : ''}`,
        x.getPixelForValue(i),
        isPercentage ? top - 10 : chart.getDatasetMeta(0).data[i].y - 10
      );
    }
  },
};

@Component({
  selector: 'app-dash-bar-chart',
  templateUrl: './dash-bar-chart.component.html',
  styleUrls: ['./dash-bar-chart.component.css'],
  standalone: true,
  imports: [
    DashStatusLegendComponent
  ]
})
export class DashBarChartComponent implements OnInit {
  @Input() dbId!: number;
  @Input() data: any[] = [];
  @Input() action: any;
  @Input() labels: any[] = [];
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];
  @Input() showTotal = true;
  @Input() isPercentage = false;
  @Input() hideTooltip = false;
  @Input() formatNumbers = false;
  @Input() title = '';
  @Input() loading = false;

  @ViewChild('chartEl') chartEl!: ElementRef;
  @ViewChild('container') containerEl!: ElementRef;

  chart!: any;
  dialogRef!: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    //private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initChart();
  }

  get empty(): boolean {
    return !this.data.length;
  }

  get containerWidth(): string {
    const offsetWidth = this.containerEl.nativeElement.offsetWidth ?? 0;
    const childrenWith = 125 * this.chartData.labels.length;
    return childrenWith > offsetWidth + 10 ? `${childrenWith}px` : '100%';
  }

  get chartData() {
    const labels: string[] = [];
    const data: number[] = [];
    const colors: string[] = [];
    this.data.forEach((item) => {
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
          barPercentage: 0.4,
          categoryPercentage: 0.95,
        },
      ],
    };
  }
  
  get totalCount(): number {
    return (
      this.chartData.datasets?.[0]?.data?.reduce(
        (acc: number, item: number) => acc + item,
        0
      ) ?? 0
    );
  }

  get options(): any {
    const _options: any = {
      maintainAspectRatio: false,
      hover: {
        mode: 'index',
        intersect: false,
      },
      layout: {
        padding: {
          top: 20,
          bottom: 10,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            minRotation: 0,
            maxRotation: 0,
            // callback: (tickValue: any) => {
            //   return strToArray(
            //     this.getLabelForValue(tickValue as number),
            //     10,
            //     2
            //   );
            // },
          },
        },
        y: {
          display: false,
          beginAtZero: true,
          max: this.isPercentage ? 100 : undefined,
          min: 0,
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
          formatNumbers: this.formatNumbers,
          lang: 'en',
        },
        tooltip: {
          enabled: !this.hideTooltip,
          mode: 'index',
          intersect: false,
          usePointStyle: true,
          callbacks: {
            title: (tooltipItems: any) => {
              return strToArray(tooltipItems[0].label, 35);
            },
            label: (tooltipItem: any) => {
              const isPercentage: any =
                this.chart.options.plugins?.backgroundBar?.isPercentage;
              const formatNumbers: any =
                this.chart.options.plugins?.backgroundBar?.formatNumbers;
              const lang: any = this.chart.options.plugins?.backgroundBar?.lang;
              return ` ${
                formatNumbers
                  ? nFormatter(tooltipItem.raw as number, 2, lang || 'en')
                  : tooltipItem.formattedValue
              }${isPercentage ? '%' : ''}`;
            },
          },
        },
      },
    };

    if (this.action) {
      _options.onClick = (_e: any, data: any) => {
        const element = data[0];
        switch (this.action.action.type) {
          case 'table':
            this.openDialog();
            break;
          case 'navigate':
            const item = this.data[element.index];
            this.router.navigate(
              [item?.extraValue?.[this.action.action.property]],
              { relativeTo: this.route, queryParamsHandling: 'preserve' }
            );
            break;
        }
      };
      _options.onHover = (event: any, chartElement: any) => {
        if (event.native?.target) {
          event.native.target.style.cursor = chartElement[0]
            ? 'pointer'
            : 'default';
        }
      };
    }

    return _options;
  }
  
  private initChart() {
    if (this.chartEl) {
      this.chart = new Chart(this.chartEl.nativeElement, {
        plugins: [backgroundBar],
        type: 'bar',
        data: this.chartData,
        options: this.options,
      });
    }
  }

  openDialog(filters?: any) {
    // this.dialogRef = this.modalService.open(TableModalComponent, {
    //   ariaLabelledBy: 'modal-basic-title',
    //   size: 'lg',
    //   windowClass: 'modal-lg',
    // });
    // this.dialogRef.componentInstance.data = {
    //   dbId: this.dbId,
    //   action: this.action,
    //   filters: this.propertyFilters,
    //   componentFilters: this.componentFilters,
    // };
  }  

}
