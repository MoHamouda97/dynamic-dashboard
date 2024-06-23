import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dynamic-dashboard';

  status: any[] = [
    {label: 'Legend 1', color: 'red'},
    {label: 'Legend 2', color: 'blue'},
    {label: 'Legend 3', color: 'green'},
  ]

}
