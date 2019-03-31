import { Component } from '@angular/core';
import { ViewType } from './types/view.type';
import { UserDataService } from './services/user-data/user-data.service';
import { SpeechService } from './services/speech/speech.service';
import { CountryService } from './services/country/country.service';
import { AgeOfDeathService } from './services/age-of-death/age-of-death.service';
import { AgeAndGender, AgeAndGenderService } from './services/age-and-gender/age-and-gender.service';

// const imageUrl = 'https://www.biography.com/.image/t_share/MTUxNTgzODk3Mjk2MDUzNTE2/gettyimages-870916736.jpg';
// const imageUrl = 'http://thecomedyspot.net/wp-content/uploads/2015/02/people-smiling2.jpg';

@Component({
  selector: 'lc-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  today = new Date();
  yearOfBirth = 1990;
  yearsToLife = 75;
  yearOfDeath = this.yearOfBirth + this.yearsToLife;
  age = this.today.getFullYear() - this.yearOfBirth;
  gender: string = null;
  country: string = null;
  percentageLivedSoFar = ((this.age / this.yearsToLife) * 100).toFixed(2);
  view: ViewType = 'timeline';
  user$ = this.userData.user$;

  constructor(private speech: SpeechService,
              private countryService: CountryService,
              private ageOfDeathService: AgeOfDeathService,
              private ageAndGenderService: AgeAndGenderService,
              private userData: UserDataService) {
  }

  clearStorage() {
    localStorage.clear();
    document.location.reload();
  }

  setView(view: ViewType): void {
    this.view = view;
  }

  async markUserAsNotNew(photo): Promise<void> {
    this.userData.patch({ isNew: false });
    // TODO: May be show some hints of how to use UI
    try {
      const { age, gender }: AgeAndGender = await this.ageAndGenderService.get(photo);
      this.age = age;
      this.gender = gender;
    } catch (e) {
      console.error(e);
    }
    this.yearsToLife = await this.ageOfDeathService.get(this.user$.value.country, this.gender);
    this.yearOfBirth = this.today.getFullYear() - this.age;
    this.yearOfDeath = this.yearOfBirth + this.yearsToLife;
    const msgAge = this.age && this.gender
                   ? `Your are ${this.ageAndGenderService.genderStr()} and you are ${this.age} years old.`
                   : 'Please specify your age and gender.';
    const msgCountry = this.user$.value.country ? `You are living in ${this.user$.value.country}.` : 'Please choose your country.';
    const msgAgeOfDeath = `Your will die at the in ${this.yearOfDeath} age of ${this.yearsToLife}.`;
    await this.speech.speak(`${msgAge} ${msgCountry} So ${msgAgeOfDeath} `);
  }
}
