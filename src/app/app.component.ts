import { Component } from '@angular/core';
import { ViewType } from './types/view.type';
import { SpeechService } from './services/speech/speech.service';
import { CountryService } from './services/country/country.service';
import { AgeOfDeathService } from './services/prediction/age-of-death.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  today = new Date();
  yearOfBirth = 1990;
  yearsToLife = 75;
  ageOfDeath: number = null;
  yearOfDeath = this.yearOfBirth + this.yearsToLife;
  age = this.today.getFullYear() - this.yearOfBirth;
  percentageLivedSoFar = ((this.age / this.yearsToLife) * 100).toFixed(2);
  view: ViewType = 'vertical';
  country: string = null;
  sex: string = null;

  constructor(private speech: SpeechService,
              private countryService: CountryService,
              private ageOfDeathService: AgeOfDeathService) {
  }

  setView(view: ViewType): void {
    this.view = view;
  }

  async welcomeUser() {
    this.country = await this.countryService.get();
    this.ageOfDeath = await this.ageOfDeathService.get(this.country, this.sex);
    const msgAgeOfDeath = `Your will die at the age of ' + ${this.ageOfDeathService}.`;
    const msgCountry = this.country ? 'Because you are living into ' + this.country : 'Please choose your country';
    await this.speech.speak(`${msgAgeOfDeath}${msgCountry}`);
  }
}
