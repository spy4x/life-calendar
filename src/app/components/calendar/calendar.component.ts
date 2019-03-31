import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { ViewType } from '../../types/view.type';
import { getAchievementsByYears } from '../../../data/achievements';
import { SpeechService } from '../../services/speech/speech.service';

interface Year {
  title: string;
  months: { title: string, passed: boolean }[];
}

@Component({
  selector: 'lc-calendar',
  templateUrl: './calendar.component.pug',
  styleUrls: ['./calendar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() yearOfBirth: number;
  @Input() lifeExpectancy: number;
  @Input() yearOfDeath: number;
  @Input() age: number;
  @Input() percentageLivedSoFar: number;
  @Input() view: ViewType;
  @Input() today: Date;
  @Input() activeLifeGap: number;
  years: Year[];
  private achievementsByYears: { age: any; desc: any }[];

  constructor(private speech: SpeechService) {}

  async ngOnInit() {
    await this.speech.speak(`Here you can see achievements of famous people before and after your age`);
    await this.speech.speak(`Don't scroll to the bottom. You won't like it there.`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const thus = this;
    if ((changes.yearOfBirth || changes.lifeExpectancy || changes.view) && this.yearOfBirth && this.lifeExpectancy) {
      this.years = this.generateYears();
      // if (this.view === 'radialBar') {
      //   setTimeout(() => {
      //     this.drawChart.apply(thus);
      //   });
      // }
    }
  }

  getItems() {
    const arr = this.achievementsByYears
      .filter(item => item.age < this.lifeExpectancy)
      .map(item => ({ ...item, type: 'archive' }));
    arr.push({
      age: 0,
      desc: `${this.yearOfBirth} - Born 👶`,
      type: 'terminator',
    });
    arr.push({
      age: this.age,
      desc: `${this.today.getFullYear()} - ${this.age} years old 😎`,
      type: 'event',
    });
    arr.push({
      age: this.activeLifeGap,
      desc: ` ${this.yearOfBirth + this.activeLifeGap} - ${this.activeLifeGap} years old - Retirement 👴🏽`,
      type: 'event',
    });
    arr.push({
      age: this.lifeExpectancy,
      desc: `${this.yearOfDeath} - ${this.lifeExpectancy} years old - Life expectancy 💀`,
      type: 'terminator',
    });
    return arr.sort((a, b) => a.age !== b.age ? a.age - b.age : (['terminator', 'event'].includes(a.type) ? -1 : 1));
  }

  refreshItems() {
    this.achievementsByYears = getAchievementsByYears();
  }

  private generateYears(): Year[] {
    this.refreshItems();
    const years: Year[] = [];
    for (let year = this.yearOfBirth; year <= this.yearOfDeath; year++) {
      const yearItem: Year = {
        title: year + '',
        months: [],
      };
      for (let month = 1; month <= 12; month++) {
        yearItem.months.push({
          title: month + '',
          passed: this.today > new Date(`${year}-${month}-31`),
        });
      }
      years.push(yearItem);
    }
    return years;
  }

  getClass(item: { type: string; age: any; desc: any }) {
    const age1 = Math.min(this.age, this.activeLifeGap);
    if (item.age < age1) {
      return 'is-primary';
    } else if (item.age >= age1 && item.age < this.activeLifeGap) {
      return 'is-success';
    } else if (item.age >= this.activeLifeGap && item.age < this.lifeExpectancy) {
      return 'is-warning';
    } else if (item.age >= this.lifeExpectancy) {
      return 'is-danger';
    }
  }
}
