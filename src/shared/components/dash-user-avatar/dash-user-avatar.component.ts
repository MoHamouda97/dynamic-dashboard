import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dash-user-avatar',
  templateUrl: './dash-user-avatar.component.html',
  styleUrls: ['./dash-user-avatar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class DashUserAvatarComponent implements OnInit {
  @Input() user: any;
  @Input() label!: string;
  @Input() customClass: string = "";
  @Input() hideLabel: boolean = false;
  @Input() hideText: boolean = false;
  @Input() size: "normal" | "large" | "xlarge" = "normal";
  
  constructor() { }

  ngOnInit(): void {
  }

}
