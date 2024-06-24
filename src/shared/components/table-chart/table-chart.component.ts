import { HttpClient } from "@angular/common/http";
import { Component, Inject, Input, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

@Component({
  selector: "db-table-chart",
  standalone: true,
  imports: [],
  templateUrl: "./table-chart.component.html",
  styleUrls: ["./table-chart.component.scss"],
})
export class TableChartComponent implements OnInit {
  @Input() data!: any;

  loading = new BehaviorSubject<boolean>(true);
  columns = new BehaviorSubject<any[]>([]);
  values = new BehaviorSubject<any[]>([]);

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.loading.next(true);
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
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe(({ data }) => {
        this.columns.next(
          data.labels.map((label: any) => ({
            header: label.label,
            field: label.key,
          }))
        );
        this.values.next(data.values);
      });
  }
}