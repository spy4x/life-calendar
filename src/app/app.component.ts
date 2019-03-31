import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ViewType } from './types/view.type';
import { UserDataService } from './services/user-data/user-data.service';
import { SpeechService } from './services/speech/speech.service';
import { ConnectionStatusService } from './services/connection-status/connection-status.service';
import { SwUpdate } from '@angular/service-worker';
import { first } from 'rxjs/operators';
import { concat, interval } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'lc-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
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
  isAppOnline$ = this.connectionStatus.isOnline();
  isNewVersionAvailable = false;

  constructor(private userData: UserDataService,
              private speech: SpeechService,
              private connectionStatus: ConnectionStatusService,
              private swUpdate: SwUpdate,
              private appRef: ApplicationRef) {
  }

  ngOnInit(): void {
    this.runTimerThatChecksForUpdate();
    this.swUpdate.available.subscribe(() => {
      this.isNewVersionAvailable = true;
    });
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

  runTimerThatChecksForUpdate(): void {
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const everyMinute$ = interval(60000); // every 1 minute
    const everyMinuteAfterAppIsStable$ = concat(appIsStable$, everyMinute$);

    everyMinuteAfterAppIsStable$.subscribe(async () => {
      try {
        await this.swUpdate.checkForUpdate();
      } catch (error) {
        if (error.message === 'Service workers are disabled or not supported by this browser' && !environment.production) {
          // it's ok for development
        } else {
          throw error;
        }
      }
    });
    this.swUpdate.checkForUpdate();
  }

  updateApp(): void {
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }
}
