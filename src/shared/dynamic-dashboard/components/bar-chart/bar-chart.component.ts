import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { ChartData } from "chart.js";
import { Observable, combineLatest, finalize, map, switchMap, tap } from "rxjs";
import { DashBarChartComponent } from "src/shared/components/dash-bar-chart/dash-bar-chart.component";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  standalone: true,
  imports: [
    DashBarChartComponent
  ],
  host: {
    class: "block",
  },
})
export class BarChartComponent implements OnInit {
  @Input() dbId!: number;
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];
  @Input() chartData!: any;

  labels: any[] = [];
  loading: boolean = false;
  data: any[] = [];

  constructor(private httpClient: HttpClient) {}

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

  get chartData$() {
    return new Observable<any>((observer) => {
      observer.next(this.chartData);
      observer.complete();
    });
  }

  get componentFilters$() {
    return new Observable<any[]>((observer) => {
      observer.next(this.componentFilters);
      observer.complete();
    });
  }

  get propertyFilters$() {
    return new Observable<any[]>((observer) => {
      observer.next(this.propertyFilters);
      observer.complete();
    });
  }

  fetchData(chartData: any, cFilters: any[], pFilters: any[]) {
    this.loading = true;
    return this.httpClient
      .post<any>("dashboards/chart?type=bar", {
        DashboardId: this.dbId,
        ChartType: "BarChart",
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
            const legendVal = val.extraValue.find(
              (item: any) => !!item[chartData.query.legendProperty]
            )?.[chartData.query.legendProperty];
            const label = data.labels.find(
              (label: any) => label.key === legendVal?.value?.key
            );
            return {
              label: val.key,
              count: val.value,
              color: label?.color || "#000000",
              extraValue: val.extraValue.reduce(
                (acc: any, item: any) => (acc = { ...acc, ...item }),
                {}
              ),
            };
          });
        })
      );
  }

}
