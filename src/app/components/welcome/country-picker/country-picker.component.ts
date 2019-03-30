import { Component, OnInit } from '@angular/core';
import { SpeechService } from '../../../services/speech/speech.service';
import { CountryService } from '../../../services/country/country.service';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { AGES } from '../../../../data/ages-wiki';

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
    await this.speech.speak(`Let's see where you are from...`);
    this.getCountry();
  }

  async getCountry(): Promise<void> {
    try {
      this.country = await this.countryService.get();
      this.setCountry(this.country);
    } catch (error) {
      console.error(`Couldn't recognize country.`, error);
      await this.speech.speak(`Can't recognize your country. Please choose it manually.`);
      this.isCountryRecognitionError = true;
    }
    this.isRecognizing = false;
  }

  async setCountry(country: string): Promise<void> {
    await this.speech.speak(`Wow, you are from ${country}! Ok.`);
    this.userData.patch({ country });
  }
}
