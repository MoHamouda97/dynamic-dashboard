import { DecimalPipe, NgTemplateOutlet } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
//import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "db-split-chart",
  standalone: true,
  imports: [DecimalPipe, NgTemplateOutlet],
  templateUrl: "./split-chart.component.html",
  styleUrls: ["./split-chart.component.scss"],
  host: {
    class: "w-full",
  },
  providers: [],
})
export class DashSplitChartComponent implements OnInit {
  @Input() dbId!: number;
  @Input() data: any[] = [];
  @Input() action: any;
  @Input() loading: boolean = false;
  @Input() title!: string;
  @Input() positiveColor!: string;
  @Input() negativeColor!: string;
  @Input() positiveIcon!: string;
  @Input() negativeIcon!: string;
  @Input() componentFilters: any[] = [];
  @Input() propertyFilters: any[] = [];

  dialogRef!: any;
  empty: boolean = false;
  ratios: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.computeEmpty();
    this.computeRatios();
  }

  ngOnChanges(): void {
    this.computeEmpty();
    this.computeRatios();
  }

  computeEmpty(): void {
    this.empty = !this.data.length;
  }

  computeRatios(): void {
    if (this.data.length >= 2) {
      const total = this.data[0].count + this.data[1].count;
      this.ratios = [
        (this.data[0].count / total) * 100,
        (this.data[1].count / total) * 100,
      ];
    } else {
      this.ratios = [];
    }
  }

  openDialog(positive?: boolean): void {
    // if (!this.action) return;
    // let _filters = positive
    //   ? this.action.query.PositiveValues?.map((item: any) => ({
    //       PropertyKey: this.action.query.PivotProperty,
    //       PropertyValue: item,
    //     }))
    //   : this.action.query.NegativeValues?.map((item: any) => ({
    //       PropertyKey: this.action.query.PivotProperty,
    //       PropertyValue: item,
    //     })) || [];
    // _filters = [..._filters, ...this.propertyFilters];
    // this.dialogRef = this.dialogService.open(TableModalComponent, {
    //   header: this.title,
    //   data: {
    //     dbId: this.dbId,
    //     action: this.action,
    //     filters: _filters,
    //     componentFilters: this.componentFilters,
    //   },
    //   contentStyle: {
    //     height: "80vh",
    //   },
    //   styleClass: "modal-lg",
    // });
  }

}
