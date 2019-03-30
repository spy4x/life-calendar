import { Component } from '@angular/core';
import { ViewType } from './types/view.type';
import { SpeechService } from './services/speech/speech.service';
import { CountryService } from './services/country/country.service';
import { AgeOfDeathService } from './services/age-of-death/age-of-death.service';
import { AgeAndGender, AgeAndGenderService } from './services/age-and-sex/age-and-sex.service';

const imageUrl = 'https://www.biography.com/.image/t_share/MTUxNTgzODk3Mjk2MDUzNTE2/gettyimages-870916736.jpg';

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
  gender: string = null;
  percentageLivedSoFar = ((this.age / this.yearsToLife) * 100).toFixed(2);
  view: ViewType = 'vertical';
  country: string = null;

  constructor(private speech: SpeechService,
              private countryService: CountryService,
              private ageOfDeathService: AgeOfDeathService,
              private ageAndGenderService: AgeAndGenderService) {
  }

  setView(view: ViewType): void {
    this.view = view;
  }

  async welcomeUser() {
    try {
      const { age, gender }: AgeAndGender = await this.ageAndGenderService.get(imageUrl);
      this.age = age;
      this.gender = gender;
    } catch (e) {
      console.error(e);
    }
    this.country = await this.countryService.get();
    this.ageOfDeath = await this.ageOfDeathService.get(this.country, this.gender);
    const msgAge = this.age && this.gender
                   ? `Your are ${this.ageAndGenderService.genderStr()} and you are ${this.age} years old.`
                   : 'Please specify your age and gender.';
    const msgCountry = this.country ? `You are living into ${this.country}.` : 'Please choose your country.';
    const msgAgeOfDeath = `Your will die at the age of ${this.ageOfDeath}.`;
    await this.speech.speak(`${msgAge} ${msgCountry} So ${msgAgeOfDeath} `);
  }
}

