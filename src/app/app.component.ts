import { Component } from '@angular/core';
import { ViewType } from './+shared/types/view.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  yearOfBirth = 1990;
  years = 75;
  view: ViewType = 'vertical';

  constructor() {
  }

  setView(view: ViewType): void {
    this.view = view;
  }
}
