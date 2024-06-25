import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashStatusLegendComponent } from 'src/shared/components/dash-status-legend/dash-status-legend.component';
import { DashBarChartComponent } from 'src/shared/components/dash-bar-chart/dash-bar-chart.component';
import { DashDoughnutChartComponent } from 'src/shared/components/dash-doughnut-chart/dash-doughnut-chart.component';
import { DashPerformanceGaugeComponent } from 'src/shared/components/dash-performance-gauge/dash-performance-gauge.component';
import { DashPerformanceIndicatorChartComponent } from 'src/shared/components/dash-performance-indicator-chart/dash-performance-indicator-chart.component';
import { DashPreviewPropComponent } from 'src/shared/components/dash-preview-prop/dash-preview-prop.component';
import { DashSplitChartComponent } from 'src/shared/components/dash-split-chart/dash-split-chart.component';
import { DashStackedBarChartComponent } from 'src/shared/components/dash-stacked-bar-chart/dash-stacked-bar-chart.component';
import { DashUserAvatarComponent } from 'src/shared/components/dash-user-avatar/dash-user-avatar.component';
import { TableChartComponent } from 'src/shared/components/table-chart/table-chart.component';
import { PropertiesBarCardComponent } from 'src/shared/dynamic-chart/components/properties-bar-card/properties-bar-card.component';
import { DynamicChartComponent } from 'src/shared/dynamic-chart/dynamic-chart.component';
import { DashboardBuilderComponent } from 'src/shared/dashboard-builder/dashboard-builder.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // COMPONENTS
    DashStatusLegendComponent,
    DashBarChartComponent,
    DashDoughnutChartComponent,
    DashPerformanceGaugeComponent,
    DashPerformanceIndicatorChartComponent,
    DashPreviewPropComponent,
    DashSplitChartComponent,
    DashStackedBarChartComponent,
    DashUserAvatarComponent,
    TableChartComponent,

    DynamicChartComponent,
    DashboardBuilderComponent,

    PropertiesBarCardComponent
  ],
  providers: [
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
