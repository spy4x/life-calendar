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
  today = new Date();
  yearOfBirth = 1990;
  yearsToLife = 75;
  yearOfDeath = this.yearOfBirth + this.yearsToLife;
  age = this.today.getFullYear() - this.yearOfBirth;
  persentageLivedSoFar = ((this.age / this.yearsToLife) * 100).toFixed(2);
  view: ViewType = 'vertical';
  country: string = null;

  constructor(private speech: SpeechService, private countryService: CountryService) {
  }

  setView(view: ViewType): void {
    this.view = view;
  }

  async welcomeUser() {
    this.country = await this.countryService.get();
    await this.speech.speak(this.country ? 'Welcome to ' + this.country : 'Please choose your country');
  }
}
