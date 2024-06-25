import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NumberPipe } from 'src/shared/pipes/number.pipe';
import { DashUserAvatarComponent } from '../dash-user-avatar/dash-user-avatar.component';

@Component({
  selector: 'app-dash-preview-prop',
  templateUrl: './dash-preview-prop.component.html',
  styleUrls: ['./dash-preview-prop.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NumberPipe,
    DashUserAvatarComponent
  ],
})
export class DashPreviewPropComponent implements OnChanges {
  @Input() prop: any;
  @Input() props!: any[];
  @Input() key!: string;
  @Input() icon!: string;
  @Input() color: string = "var(--primary-color)";
  @Input() customClass: string = "";
  @Input() hideLabel: boolean = false;
  
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["props"]) {
      if (this.props && this.key && !this.prop) {
        this.prop = this.props.find((val: any) => val?.key === this.key);
      }
    }
  }

}
