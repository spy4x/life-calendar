import { Component } from '@angular/core';
import { ViewType } from './types/view.type';
import { SpeechService } from './services/speech/speech.service';
import { CountryService } from './services/country/country.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  yearOfBirth = 1990;
  years = 75;
  view: ViewType = 'vertical';

  constructor(private speech: SpeechService, private country: CountryService) {
    this.welcomeUser();
  }

  setView(view: ViewType): void {
    this.view = view;
    this.speech.speak('Switch to ' + view);
  }

  async welcomeUser() {
    const country = await this.country.get();
    await this.speech.speak(country ? 'Welcome to ' + country : 'Please choose your country');
  }
}
