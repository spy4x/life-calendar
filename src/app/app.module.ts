import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ViewSwitcherComponent } from './components/view-switcher/view-switcher.component';
import { SpeechService } from './services/speech/speech.service';
import { HttpClientModule } from '@angular/common/http';
import { CountryService } from './services/country/country.service';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    ViewSwitcherComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [SpeechService, CountryService],
  bootstrap: [AppComponent],
})
export class AppModule {}
