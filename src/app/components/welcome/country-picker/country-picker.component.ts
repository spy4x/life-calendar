import { Component, OnInit } from '@angular/core';
import { SpeechService } from '../../../services/speech/speech.service';
import { CountryService } from '../../../services/country/country.service';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { AGES } from '../../../../data/ages-wiki';
import { sleep } from '../../../services/sleep.helper';

@Component({
  selector: 'lc-welcome-country-picker',
  templateUrl: './country-picker.component.pug',
  styleUrls: ['./country-picker.component.sass'],
})
export class WelcomeCountryPickerComponent implements OnInit {
  countries = Object.keys(AGES).sort();
  user$ = this.userData.user$;
  country: string = this.user$.value.country;
  isCountryRecognitionError = false;
  isRecognizing = true;

  constructor(private speech: SpeechService,
              private countryService: CountryService,
              private userData: UserDataService) { }

  async ngOnInit() {
    await Promise.all([this.speech.speak(`Let's see where you are from...`), sleep(2000)]);
    this.getCountry();
  }

  async getCountry(): Promise<void> {
    try {
      this.country = await Promise.race([this.countryService.get(), sleep(5000)]) || null;
      if (!this.country) {
        throw new Error(`Timeout happened`);
      }
      this.setCountry(this.country);
    } catch (error) {
      console.error(`Couldn't recognize country.`, error);
      await this.speech.speak(`Can't recognize your country. Please choose it manually.`);
      this.isCountryRecognitionError = true;
    }
    this.isRecognizing = false;
  }

  async setCountry(country: string): Promise<void> {
    await Promise.all([this.speech.speak(`Wow, you are from ${country}! Ok.`), sleep(2000)]);
    this.userData.patch({ country });
  }
}
