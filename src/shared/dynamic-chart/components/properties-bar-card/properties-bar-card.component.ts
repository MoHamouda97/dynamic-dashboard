
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, Inject, Input } from "@angular/core";
import { ChartData } from "chart.js";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { finalize, map, switchMap, tap } from "rxjs/operators";
import { DashBarChartComponent } from "src/shared/components/dash-bar-chart/dash-bar-chart.component";

@Component({
  selector: 'app-properties-bar-card',
  templateUrl: './properties-bar-card.component.html',
  styleUrls: ['./properties-bar-card.component.css'],
  standalone: true,
  imports: [
    DashBarChartComponent
  ],
  host: {
    class: "block",
  },
})
export class PropertiesBarCardComponent implements OnInit {
  httpClient: HttpClient = Inject(HttpClient)

  @Input() dbId!: number;
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];
  @Input() chartData!: any;

  labels: string[] = [];
  loading: boolean = false;
  data: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  get chartData$(): Observable<ChartData> {
    return new Observable<ChartData>((observer) => {
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

  loadData() {
    this.loading = true;

    combineLatest([
      this.chartData$,
      this.componentFilters$,
      this.propertyFilters$,
    ])
      .pipe(
        switchMap(([cd, cf, pf]: [any, any[], any[]]) => {
          return this.fetchData(cd, cf, pf);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((data) => this.data = data);
  }

  fetchData(chartData: any, cFilters: any[], pFilters: any[]) {
    return this.httpClient
      .post<any>("dashboards/chart?type=propertiesBar", {
        DashboardId: this.dbId,
        ChartType: "PropertiesBarChart",
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
          return data.labels.map((val: any) => {
            return {
              label: val.label,
              count: data.values[val.key] || 0,
              color: val?.color || "#000000",
            };
          });
        })
      );
  }

}
