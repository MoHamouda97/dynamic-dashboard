import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, Inject, Input, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { finalize, map, switchMap, tap } from "rxjs/operators";
import { DashStackedBarChartComponent } from 'src/shared/components/dash-stacked-bar-chart/dash-stacked-bar-chart.component';

@Component({
  selector: 'app-stacked-bar-card',
  templateUrl: './stacked-bar-card.component.html',
  styleUrls: ['./stacked-bar-card.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    DashStackedBarChartComponent
  ],
  host: {
    class: "block",
  }
})
export class StackedBarCardComponent implements OnInit {
  @Input() dbId!: number;
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];
  @Input() chartData!: any;
  @Input() title!: string;

  httpClient: HttpClient = Inject(HttpClient);

  labels: any[] = [];
  xlabels: any[] = [];
  loading: boolean = false;
  data: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    combineLatest([
      new BehaviorSubject(this.chartData),
      new BehaviorSubject(this.componentFilters),
      new BehaviorSubject(this.propertyFilters),
    ])
      .pipe(
        switchMap(([cd, cf, pf]: [any, any[], any[]]) => {
          return this.fetchData(cd, cf, pf);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((data) => this.data = data);
  }

  fetchData(chartData: any, cFilters: any[], pFilters: any[]) {
    return this.httpClient
      .post<any>("dashboards/chart?type=bar", {
        DashboardId: this.dbId,
        ChartType: "BarStackChart",
        Selection: chartData.selection,
        Query: chartData.query,
        Filters: pFilters,
        ComponentFilters: cFilters,
      })
      .pipe(
        tap(({ data }) => {
          this.labels = data.labels.stackLookup;
          this.xlabels = data.labels.xAxisLookup.map((item: any) => item.label);
        }),
        map(({ data }) => {
          const dataset = data.labels.stackLookup.map((val: any) => {
            return {
              label: val.label,
              key: val.key,
              dataKeys: data.labels.xAxisLookup.map((item: any) => item.key),
              count: data.labels.xAxisLookup.map(
                (item: any) => data.values[item.key]?.[val.key] ?? 0
              ),
              color: val.color,
            };
          });
          if (data.values?.na) {
            dataset.push({
              label: "NA",
              key: "na",
              dataKeys: data.labels.xAxisLookup.map((item: any) => item.key),
              count: data.labels.stackLookup.map(
                (item: any) => data.values["na"]?.[item.key] ?? 0
              ),
              color: "#000000",
            });
          }
          return dataset;
        })
      );
  }  

}
