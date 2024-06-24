import { Component, Input, OnInit } from '@angular/core';
import { DashDoughnutChartComponent } from 'src/shared/components/dash-doughnut-chart/dash-doughnut-chart.component';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
//import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-multi-doughnut-card',
  templateUrl: './multi-doughnut-card.component.html',
  styleUrls: ['./multi-doughnut-card.component.css'],
  standalone: true,
  imports: [
    DashDoughnutChartComponent
  ]
})
export class MultiDoughnutCardComponent implements OnInit {
  @Input() dbId!: number;
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];
  @Input() title?: any;
  @Input() chartData: any[] = [];

  labels: any[] = [];
  data: any[] = [];
  loading: boolean = false;
  
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin(
      this.chartData.map((chart) =>
        this.httpClient
          .post<any>("dashboards/chart?type=multidoughnut", {
            DashboardId: this.dbId,
            ChartType: "DonutChart",
            Selection: chart.selection,
            Query: chart.query,
            Filters: this.componentFilters,
            ComponentFilters: this.componentFilters,
          })
          .pipe(catchError((error) => of(error)))
      )
    )
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((responses) => {
        const data: any[] = [];
        const labels: any[] = [];
        responses.forEach((response) => {
          if (!response.data) {
            data.push(null);
            return;
          }

          data.push(
            response.data.values.map((val: any) => {
              const label = response.data.labels.find(
                (label: any) => label.key === val.key
              );
              return {
                key: label?.key ?? "na",
                label: label?.label ?? "NA",
                count: val.value,
                color: label?.color ?? "#000000",
              };
            })
          );
          labels.push(response.data.labels);
        });
        this.data = data;
        this.labels = labels;
      });
  }

  getLocalized(title?: any) {
    return (
      title?.[/*this.translateService.currentLang as keyof LocalizedTitle*/ 'en'] || ""
    );
  }

}
