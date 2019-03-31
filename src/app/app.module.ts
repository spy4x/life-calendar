import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ViewSwitcherComponent } from './components/view-switcher/view-switcher.component';
import { SpeechService } from './services/speech/speech.service';
import { HttpClientModule } from '@angular/common/http';
import { CountryService } from './services/country/country.service';
import { UserDataService } from './services/user-data/user-data.service';
import { WelcomeComponent } from './components/welcome/welcome/welcome.component';
import { WelcomeCountryPickerComponent } from './components/welcome/country-picker/country-picker.component';
import { AgeOfDeathService } from './services/age-of-death/age-of-death.service';
import { AgeAndGenderService } from './services/age-and-gender/age-and-gender.service';
import { WelcomeAgePickerComponent } from './components/welcome/age-picker/age-picker.component';
import { CameraComponent } from './components/welcome/camera/camera.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    ViewSwitcherComponent,
    WelcomeComponent,
    WelcomeCountryPickerComponent,
    WelcomeAgePickerComponent,
    CameraComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [SpeechService, CountryService, AgeOfDeathService, AgeAndGenderService, UserDataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
