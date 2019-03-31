import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ViewType } from './types/view.type';
import { UserDataService } from './services/user-data/user-data.service';
import { SpeechService } from './services/speech/speech.service';
import { ConnectionStatusService } from './services/connection-status/connection-status.service';
import { SwUpdate } from '@angular/service-worker';
import { first } from 'rxjs/operators';
import { concat, interval } from 'rxjs';
import { environment } from '../environments/environment';
import { sleep } from './services/sleep.helper';

interface LifeStage {
  slug: 'lived' | 'activityLeft' | 'untilDeath';
  width: number;
  text: string;
  cssClass: string;
}

@Component({
  selector: 'lc-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  view: ViewType = 'timeline';
  user$ = this.userData.user$;
  isAppOnline$ = this.connectionStatus.isOnline();
  shouldShowOfflineMessage = true;
  isNewVersionAvailable = false;
  lifeStages: LifeStage[] = [];
  showLifeExpectancy = false;
  isShowingLife = false;
  lifeShowingFinished = false;
  timelineActive = false;
  today = new Date();

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
    this.showUserHisLife();
  }

  async showUserHisLife(): Promise<void> {
    // return
    this.isShowingLife = true;
    const { age, gender, country, yearOfDeath, yearOfBirth, lifeExpectancy, yearsLeft } = this.user$.value;
    const bornMessage = `So you were born in ${country} in ${yearOfBirth}.`;
    if (age >= lifeExpectancy) {
      this.lifeStages.push({
        slug: 'lived',
        width: 100,
        text: `👶 in ${country} in ${yearOfBirth}`,
        cssClass: 'has-background-success',
      });
      await Promise.all([this.speech.speak(bornMessage), sleep(4000)]);
      this.showLifeExpectancy = true;
      await this.speech.speak(`In your country life expectancy for ${gender} is ${lifeExpectancy} years.`);
      await this.speech.speak(`Wow, you exceeded that! Impressive. I wasn't prepared for that! Happy retirement.`);
      this.lifeShowingFinished = true;
      return;
    }
    let activeLifeGap = 45;
    if (age >= 45 && age < 50) {
      activeLifeGap = 50;
    }
    if (age >= 50 && age < 55) {
      activeLifeGap = 55;
    }
    if (age >= 55 && age < 60) {
      activeLifeGap = 60;
    }
    const activeLifeYearsLeft = activeLifeGap - age;

    const livedWidth = +(100 * age / lifeExpectancy).toFixed(0);
    this.lifeStages.push({
      slug: 'lived',
      width: livedWidth > 100 ? 100 : livedWidth,
      text: `👶 in ${country} in ${yearOfBirth}`,
      cssClass: 'has-background-link',
    });
    await Promise.all([this.speech.speak(bornMessage), sleep(4000)]);

    this.showLifeExpectancy = true;
    await this.speech.speak(`In your country life expectancy for ${gender} is ${lifeExpectancy} years.`);
    await this.speech.speak(`Which is ${this.getLifeExpectancyMark(lifeExpectancy)}.`);
    await sleep(1500);

    this.lifeStages.push({
      slug: 'untilDeath',
      width: 100 - this.lifeStages.find(ls => ls.slug === 'lived').width,
      text: `You have ~${yearsLeft} years`,
      cssClass: 'has-background-info',
    });
    await Promise.all([this.speech.speak(`Do you know that about ${yearsLeft} years left?`), sleep(4000)]);
    await sleep(500);

    if (activeLifeYearsLeft > 0) {
      this.lifeStages.splice(1, 0, {
        slug: 'activityLeft',
        width: +(100 * activeLifeYearsLeft / lifeExpectancy).toFixed(0),
        text: `~${activeLifeYearsLeft} active years`,
        cssClass: 'has-background-success',
      });
      const otherStagesWidthSum = this.lifeStages.filter(ls => ls.slug !== 'untilDeath').reduce((aggr, item) => aggr + item.width, 0);
      const untilDeath = this.lifeStages.find(ls => ls.slug === 'untilDeath');
      untilDeath.width = 100 - otherStagesWidthSum;
      untilDeath.text = `~${yearsLeft - activeLifeYearsLeft} years of retirement`;
      await this.speech.speak(`But imagine that during next ${activeLifeYearsLeft} years you will be able to actively affect your life.`);
      await this.speech.speak(`After that you will be doing whatever you could reach by that moment.`);
      await this.speech.speak(`If you want to do something big, like your desired startup - move fast!`);
      await this.speech.speak(`We wish you find enough energy inside yourself to do it! Good luck!`);
    } else {
      await this.speech.speak(`It seems you had a long live! For sure it was tough, but happy life.`);
      await this.speech.speak(`We wish you calm retirement. You deserve it. Good luck!`);
    }
    this.lifeShowingFinished = true;
  }

  runTimerThatChecksForUpdate(): void {
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const every30Sec$ = interval(30000); // every 30 sec
    const every30SecAfterAppIsStable$ = concat(appIsStable$, every30Sec$);

    every30SecAfterAppIsStable$.subscribe(async () => {
      try {
        await this.swUpdate.checkForUpdate();
      } catch (error) {
        if (error.message === 'Service workers are disabled or not supported by this browser' &&
          !environment.production) {
          // it's ok for development
        } else {
          throw error;
        }
      }
    });
    // noinspection JSIgnoredPromiseFromCall
    this.swUpdate.checkForUpdate();
  }

  showTimeline() {
    if (this.lifeShowingFinished) {
      this.timelineActive = true;
    }
  }

  updateApp(): void {
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }

  getLifeExpectancyMark(lifeExpectancy: number): string {
    if (lifeExpectancy >= 85) {
      return 'very impressive';
    }
    if (lifeExpectancy >= 80) {
      return 'pretty high';
    }
    if (lifeExpectancy >= 75) {
      return 'not bad';
    }
    if (lifeExpectancy >= 70) {
      return 'above average';
    }
    if (lifeExpectancy >= 65) {
      return 'average';
    }
    return 'below average';
  }
}
