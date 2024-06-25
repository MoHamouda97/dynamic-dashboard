import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, Inject, Input, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-dash-table-chart",
  standalone: true,
  imports: [
    HttpClientModule
  ],
  templateUrl: "./table-chart.component.html",
  styleUrls: ["./table-chart.component.css"],
})
export class TableChartComponent implements OnInit {
  @Input() data!: any;

  httpClient: HttpClient = Inject(HttpClient);

  loading: boolean = true;
  columns: any[] = [];
  values: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loading =  true;

    this.httpClient
      .post<any>("dashboards/chart?type=table", {
        DashboardId: this.data.dbId,
        ChartType: "TableChart",
        Selection: this.data.selection,
        Filters: this.data.filters,
        ComponentFilters: this.data.componentFilters,
        Query: {
          Properties: this.data.properties,
        },
      })
      .pipe(
        finalize(() => (this.loading = false))
      )
      .subscribe(({ data }) => {
        this.columns = data.labels.map((label: any) => ({
          header: label.label,
          field: label.key,
        }));
        this.values = data.values;
      });
  }
}