import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-dash-performance-gauge',
  templateUrl: './dash-performance-gauge.component.html',
  styleUrls: ['./dash-performance-gauge.component.css'],
  host: {
    // "(window:resize)": "updateRadius($event)",
    class: "w-full min-w-full",
  },
  standalone: true,
  imports: [CommonModule],
})
export class DashPerformanceGaugeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('hostElement', { static: true }) hostElement!: ElementRef;
  @Input() rtl: boolean = false;
  @Input() color: string = "";
  @Input() performance: number = 0;
  @Input() set statuses(val: any[]) {
    this._statuses = val
      ?.filter((item) => item.from || item.to)
      .sort((a, b) => a.from - b.from);
  }
  get statuses() {
    return this._statuses;
  }

  private _statuses: any[] = [];
  private resizeObserver: ResizeObserver;

  radius: number = 0;
  outerRadius: number = 0;

  constructor(private changeRef: ChangeDetectorRef) {
    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        this.radius = entry.contentRect?.width / 2.5 - 15;
        this.outerRadius = this.radius + 10;
        this.changeRef.detectChanges();
      }
    });
  }

  get progressRangedDegree(): number {
    let progressRanged = this.performance > 0 ? this.performance : 0;
    return Math.min(Math.max((progressRanged / 100) * 180, 0), 180);
  }

  get pointerTransform(): string {
    return `translate(0, 0) rotate(${this.progressRangedDegree}deg)`;
  }

  minMaxScale(val: number, min: number, max: number): number {
    return ((val - min) / (max - min)) * 100;
  }

  get enhancedStatuses(): any[] {
    if (!this.statuses?.length)
      return [{ min: 0, max: 100, color: this.color }];

    let scaleMin = 0;
    let scaleMax = 100;
    this.statuses?.forEach((item) => {
      if (item.from < scaleMin) {
        scaleMin = item.from;
      }
      if (item.to > scaleMax) {
        scaleMax = item.to;
      }
    });

    const statusesTrimmed = this.statuses.map((e) => {
      const radius = this.outerRadius;
      const min = e.from ? this.minMaxScale(e.from, scaleMin, scaleMax) : 0;
      const max = e.to ? this.minMaxScale(e.to, scaleMin, scaleMax) : 100;
      const circumference = radius * 2 * Math.PI;
      const arc = circumference * 0.5;
      const dashArray = `${arc} ${circumference}`;
      const transformAngle = 180 + (min * 180) / 100;
      const textRadius = radius + 15;
      const textX = textRadius * Math.cos((transformAngle * Math.PI) / 180);
      const textY = textRadius * Math.sin((transformAngle * Math.PI) / 180);

      const transform = `rotate(${transformAngle}, ${radius}, ${radius})`;
      const offset = arc - ((max - min - 0.25) / 100) * arc;

      return {
        min,
        max,
        radius,
        dashArray,
        transform,
        offset,
        textX,
        textY,
        text: e.from || 0,
        color: e.color,
      };
    });

    return statusesTrimmed;
  }

  get gradient(): string {
    const item = this.enhancedStatuses?.find(
      (el) => el.min <= this.performance && el.max >= this.performance
    );

    if (!item) return "";

    return `conic-gradient(
      from -90deg
      at 50% 100%,
      transparent ${(item.min / 100) * 180}deg,
      ${item.color} ${(item.min / 100) * 180}deg ${(item.max / 100) * 180}deg,
      transparent ${this.progressRangedDegree}deg)`;
  }

  ngAfterViewInit() {
    this.resizeObserver.observe(this.hostElement.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.hostElement.nativeElement);
  }

}
