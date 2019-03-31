import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AgeAndGender, AgeAndGenderService } from '../../../services/age-and-gender/age-and-gender.service';
import { SpeechService } from '../../../services/speech/speech.service';
import { CountryService } from '../../../services/country/country.service';
import { AgeOfDeathService } from '../../../services/age-of-death/age-of-death.service';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { sleep } from '../../../services/sleep.helper';
import { AGES } from '../../../../data/ages-wiki';

@Component({
  selector: 'lc-welcome-age-picker',
  templateUrl: './age-picker.component.pug',
  styleUrls: ['./age-picker.component.sass'],
})
export class WelcomeAgePickerComponent implements OnInit {
  @Output() done = new EventEmitter<void>();
  isRecognizing = false;
  isRecognized = false;
  photoDataUrl: string;
  user$ = this.userData.user$;
  age: number;
  countries = Object.keys(AGES).sort();
  country = this.user$.value.country;
  gender: 'male' | 'female';
  years = Array.from(Array(100)).map((item, index) => index + 1);
  isFinishButtonClicked = false;


  constructor(private speech: SpeechService,
              private countryService: CountryService,
              private ageOfDeathService: AgeOfDeathService,
              private ageAndGenderService: AgeAndGenderService,
              private userData: UserDataService) {}

  async ngOnInit() {
    await Promise.all([this.speech.speak(`Let me look at your face to understand your age and gender`), sleep(2000)]);
  }

  async usePhoto(photoDataUrl: string | null): Promise<void> {
    try {
      if (!photoDataUrl) {
        throw new Error('No photo was provided');
      }
      this.photoDataUrl = photoDataUrl;
      this.isRecognizing = true;
      const { age, gender }: AgeAndGender = await this.ageAndGenderService.get(photoDataUrl);

      const result = await Promise.race([this.ageAndGenderService.get(photoDataUrl), sleep(5000)]) || null;
      if (!result) {
        throw new Error(`cant-recognize-age`);
      }
      this.age = age;
      this.gender = gender;
      await Promise.all([this.speech.speak(`I guess you are ${age} years old ${gender}. Am I right?`), sleep(2000)]);
    } catch (e) {
      if (e.message === 'cant-recognize-age') {
        await this.speech.speak(`Hmm... I couldn't recognize your age.`);
      } else {
        console.error(e);
        await this.speech.speak(`Ohhh, I can't see your face.`);
      }
      this.age = 25;
      this.gender = 'male';
      await this.speech.speak(`Ok, we'll handle it together. Provide your age.`);
    }
    this.isRecognizing = false;
    this.isRecognized = true;
  }

  async finish() {
    this.isFinishButtonClicked = true;
    await this.speech.speak(`Awesome. Let's see what that means...`);
    const { age, gender, country } = this;
    const lifeExpectancy = await this.ageOfDeathService.get(country, gender);
    const yearOfBirth = new Date().getFullYear() - age;
    const yearOfDeath = yearOfBirth + lifeExpectancy;
    const yearsLeft = lifeExpectancy - age;
    const percentageLivedSoFar: number = parseFloat(((age / lifeExpectancy) * 100).toFixed(2));
    this.userData.patch({
      age: +age,
      gender,
      country,
      lifeExpectancy,
      yearOfBirth,
      yearOfDeath,
      yearsLeft,
      percentageLivedSoFar,
    });
    this.done.emit();
  }
}
