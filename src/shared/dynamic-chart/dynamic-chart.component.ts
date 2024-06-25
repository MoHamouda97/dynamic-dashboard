import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DoughnutCardComponent } from './components/doughnut-card/doughnut-card.component';
import { MultiDoughnutCardComponent } from './components/multi-doughnut-card/multi-doughnut-card.component';
import { PropertiesBarCardComponent } from './components/properties-bar-card/properties-bar-card.component';
import { StackedBarCardComponent } from './components/stacked-bar-card/stacked-bar-card.component';
import { TableModalComponent } from './components/table-modal/table-modal.component';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { DashStackedBarChartComponent } from '../components/dash-stacked-bar-chart/dash-stacked-bar-chart.component';

export enum CardSize {
  full = "col-12",
  quarter = "col-6 md:col-3",
  half = "col-12 md:col-6",
  third = "col-6 md:col-4",
  two_thirds = "col-8 md:col-6",
  three_quarters = "col-12 md:col-9",
}

@Component({
  selector: 'app-dynamic-chart',
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarChartComponent,
    DoughnutCardComponent,
    MultiDoughnutCardComponent,
    PropertiesBarCardComponent,
    StackedBarCardComponent,
    TableModalComponent,
    DashStackedBarChartComponent
  ],
  host: {
    class: "block",
  },
})
export class DynamicChartComponent implements OnInit {
  @HostBinding("class") class!: string;
  @Input() dbId!: number;
  @Input() title!: any;
  @Input() type!: string;
  @Input() chartData!: any;
  @Input() withTabs: boolean = false;
  @Input() size: string = 'full';
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];
  @Input() tab: number = 0;

  tabs = combineLatest([this.chartData$, this.withTabs$]).pipe(
    map(([chartData, withTabs]) => {
      if (!withTabs) return [];
      return chartData.map((item: any, index: number) => ({
        title: this.getLocalized(item.title),
        value: index,
      }));
    })
  );

  localizedTitle$ = combineLatest(['en']).pipe(
    map((title) => title || "")
  );

  constructor(
    @Inject(HttpClient) private httpClient: HttpClient
  ) {}

  get chartData$() {
    return new Observable<any>((observer) => {
      observer.next(this.chartData);
      observer.complete();
    });
  }

  get withTabs$() {
    return new Observable<any>((observer) => {
      observer.next(this.withTabs);
      observer.complete();
    });
  }

  ngOnInit(): void {
    this.class = CardSize[this.size as keyof typeof CardSize];
  }

  getLocalized(title?: any) {
    return (
      title?.['en'] || ""
    );
  }

}
