import { Component,Inject,Input,  OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Observable, combineLatest, finalize, map, switchMap, tap } from "rxjs";
import { ChartData } from 'chart.js';
import { DashDoughnutChartComponent } from 'src/shared/components/dash-doughnut-chart/dash-doughnut-chart.component';

@Component({
  selector: 'app-doughnut-card',
  templateUrl: './doughnut-card.component.html',
  styleUrls: ['./doughnut-card.component.css'],
  standalone: true,
  imports: [
    HttpClientModule,
    DashDoughnutChartComponent
  ]
})
export class DoughnutCardComponent implements OnInit {
  @Input() dbId!: number;
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];
  @Input() chartData!: any;

  httpClient: HttpClient = Inject(HttpClient);

  labels: any[] = [];
  loading: boolean = false;
  data: any[] = [];

  constructor() {}

  ngOnInit() {
    combineLatest([
      this.chartData$,
      this.componentFilters$,
      this.propertyFilters$,
    ])
      .pipe(
        switchMap(([cd, cf, pf]) => this.fetchData(cd, cf, pf)),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((data) => {
        this.data = data;
      });
  }

  get chartData$(): Observable<ChartData> {
    return new Observable<ChartData>((observer) => {
      observer.next(this.chartData);
      observer.complete();
    });
  }

  get componentFilters$(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      observer.next(this.componentFilters);
      observer.complete();
    });
  }

  get propertyFilters$(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      observer.next(this.propertyFilters);
      observer.complete();
    });
  }

  fetchData(chartData: any, cFilters: any[], pFilters: any[]) {
    this.loading = true;
    return this.httpClient
      .post<any>("dashboards/chart?type=doughnut", {
        DashboardId: this.dbId,
        ChartType: "DonutChart",
        Selection: chartData.selection,
        Query: chartData.query,
        Filters: pFilters,
        ComponentFilters: cFilters,
      })
      .pipe(
        tap(({ data }) => {
          this.labels = data.labels;
        }),
        map(({ data }) => {
          return data.values.map((val: any) => {
            const label = data.labels.find(
              (label: any) => label.key === val.key
            );
            return {
              key: label?.key ?? "na",
              label: label?.label ?? "NA",
              count: val.value,
              color: label?.color ?? "#000000",
            };
          });
        })
      );
  }

}
