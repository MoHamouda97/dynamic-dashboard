import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dash-status-legend',
  templateUrl: './dash-status-legend.component.html',
  styleUrls: ['./dash-status-legend.component.css'],
  standalone: true
})
export class DashStatusLegendComponent implements OnInit {
  @Input() statusConfig!: {
    isSmall: boolean,
    data: {
      color: string,
      label: string
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
