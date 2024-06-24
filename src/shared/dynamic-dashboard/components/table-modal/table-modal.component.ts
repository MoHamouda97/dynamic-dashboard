import { Component, OnInit, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TableChartComponent } from "src/shared/components/table-chart/table-chart.component";

@Component({
  selector: "db-table-modal",
  standalone: true,
  imports: [TableChartComponent],
  templateUrl: "./table-modal.component.html"
})
export class TableModalComponent implements OnInit {
  data: any;
  tableData = new BehaviorSubject<any>(undefined);

  ngOnInit(): void {
    this.tableData.next({
      dbId: this.data.dbId,
      selection: this.data.action.selection,
      filters: this.data.filters,
      componentFilters: this.data.componentFilters,
      properties: this.data.action.action.properties,
    });
  }
}
