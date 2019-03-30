import { Component } from '@angular/core';
import { ViewType } from './+shared/types/view.type';
import { SpeechService } from './speech/speech.service';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  yearOfBirth = 1990;
  years = 75;
  view: ViewType = 'vertical';
  country: string;

  constructor(private speech: SpeechService, private http: HttpClient) {
    this.initCountry();
  }

  setView(view: ViewType): void {
    this.view = view;
    this.speech.speak('Switch to ' + view);
  }

  initCountry() {
    this.http.get('http://ip-api.com/json').pipe(first()).subscribe((json: { country: string }) => {
      this.country = json.country;
      this.speech.speak('Welcome from' + json.country);
    });
  }
}
