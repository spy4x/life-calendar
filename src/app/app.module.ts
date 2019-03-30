import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ViewSwitcherComponent } from './view-switcher/view-switcher.component';
import { SpeechService } from './speech/speech.service';
import { HttpClientModule } from '@angular/common/http';

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
  providers: [SpeechService],
  bootstrap: [AppComponent],
})
export class AppModule {}
