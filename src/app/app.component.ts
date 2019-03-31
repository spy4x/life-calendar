import { Component } from '@angular/core';
import { ViewType } from './types/view.type';
import { UserDataService } from './services/user-data/user-data.service';
import { SpeechService } from './services/speech/speech.service';

@Component({
  selector: 'lc-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  today = new Date();
  yearOfBirth = 1990;
  lifeExpectancy = 75;
  yearOfDeath = this.yearOfBirth + this.lifeExpectancy;
  age = this.today.getFullYear() - this.yearOfBirth;
  gender: string = null;
  country: string = null;
  percentageLivedSoFar = ((this.age / this.lifeExpectancy) * 100).toFixed(2);
  view: ViewType = 'radialBar';
  user$ = this.userData.user$;

  constructor(private userData: UserDataService, private speech: SpeechService) {
  }

  // noinspection JSMethodCanBeStatic
  clearStorage() {
    localStorage.clear();
    document.location.reload();
  }

  setView(view: ViewType): void {
    this.view = view;
  }

  async markUserAsNotNew(): Promise<void> {
    this.userData.patch({ isNew: false });
    // TODO: May be show some hints of how to use UI

    const { gender, country, yearOfDeath, lifeExpectancy, yearsLeft } = this.user$.value;
    await this.speech.speak(`So you are living in ${country} and you are ${gender}.`);
    await this.speech.speak(`Because of that your life expectancy is ${lifeExpectancy} years.`);
    await this.speech.speak(`Which means that you should be aware of year ${yearOfDeath}.`);
    await this.speech.speak(`And by the way - Do you know that you have about ${yearsLeft} years left?`);
  }
}
