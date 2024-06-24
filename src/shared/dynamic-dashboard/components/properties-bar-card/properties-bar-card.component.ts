
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, Inject, Input } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { finalize, map, switchMap, tap } from "rxjs/operators";
import { DashBarChartComponent } from 'src/shared/components/dash-bar-chart/dash-bar-chart.component';

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
  @Input() dbId!: number;
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];
  @Input() chartData!: any;

  labels = new BehaviorSubject<any[]>([]);
  loading = new BehaviorSubject<boolean>(false);
  data: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.next(true);

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
          this.loading.next(false);
        })
      )
      .subscribe((data) => this.data.next(data));
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
          this.labels.next(data.labels);
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
