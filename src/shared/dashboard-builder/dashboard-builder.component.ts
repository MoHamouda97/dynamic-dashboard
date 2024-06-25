import { Component, OnInit } from '@angular/core';
import { CardSize, DynamicChartComponent } from '../dynamic-chart/dynamic-chart.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-builder',
  templateUrl: './dashboard-builder.component.html',
  styleUrls: ['./dashboard-builder.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DynamicChartComponent
  ],
  providers: [
    HttpClient,
    HttpClientModule
  ]
})
export class DashboardBuilderComponent implements OnInit {
  CardSize = CardSize;
  dashboard: any = null;
  
  constructor() { }

  async ngOnInit(): Promise<void> {
    const dbData = await fetch("assets/db_structure.json");
    const dbJson = await dbData.json();

    this.dashboard = dbJson;
    console.log('this.dashboard', this.dashboard)
  }

}
