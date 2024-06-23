import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashStatusLegendComponent } from 'src/shared/components/dash-status-legend/dash-status-legend.component';
import { DashBarChartComponent } from 'src/shared/components/dash-bar-chart/dash-bar-chart.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashStatusLegendComponent,
    DashBarChartComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
