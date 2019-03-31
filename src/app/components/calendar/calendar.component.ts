import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
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
    return arr.sort((a, b) => a.age - b.age);
  }

  // getAge50Year() {
  //   return this.yearOfBirth + 50;
  // }

  getYoungerAge() {
    return this.achievementsByYears.filter(dead => dead.age < this.age);
  }

  getOlderAge() {
    return this.achievementsByYears.filter(dead => dead.age > this.age && dead.age < this.activeLifeGap);
  }

  getOlderNotEffective() {
    return this.achievementsByYears.filter(dead => dead.age > this.activeLifeGap && dead.age < this.lifeExpectancy);
  }

  refreshItems() {
    this.achievementsByYears = getAchievementsByYears();
  }

//   // noinspection JSMethodCanBeStatic
//   private drawChart() {
//     /* Chart code */
//     // Themes begin
//     am4core.useTheme(am4themes_animated);
// // Themes end
//
// // Create chart instance
//     const chart = am4core.create('chartdiv', am4charts.PieChart);
//
// // Let's cut a hole in our Pie chart the size of 40% the radius
//     chart.innerRadius = am4core.percent(40);
//
// // Add data
//     chart.data = [{
//       country: 'Lithuania',
//       litres: 501.9,
//       bottles: 1500,
//     }, {
//       country: 'Czech Republic',
//       litres: 301.9,
//       bottles: 990,
//     }, {
//       country: 'Ireland',
//       litres: 201.1,
//       bottles: 785,
//     }, {
//       country: 'Germany',
//       litres: 165.8,
//       bottles: 255,
//     }, {
//       country: 'Australia',
//       litres: 139.9,
//       bottles: 452,
//     }, {
//       country: 'Austria',
//       litres: 128.3,
//       bottles: 332,
//     }, {
//       country: 'UK',
//       litres: 99,
//       bottles: 150,
//     }, {
//       country: 'Belgium',
//       litres: 60,
//       bottles: 178,
//     }, {
//       country: 'The Netherlands',
//       litres: 50,
//       bottles: 50,
//     }];
//
// // Add and configure Series
//     const pieSeries = chart.series.push(new am4charts.PieSeries());
//     pieSeries.dataFields.value = 'litres';
//     pieSeries.dataFields.category = 'country';
//     pieSeries.slices.template.stroke = am4core.color('#fff');
//     pieSeries.slices.template.strokeWidth = 2;
//     pieSeries.slices.template.strokeOpacity = 1;
//
// // Disabling labels and ticks on inner circle
//     pieSeries.labels.template.disabled = true;
//     pieSeries.ticks.template.disabled = true;
//
// // Disable sliding out of slices
//     pieSeries.slices.template.states.getKey('hover').properties.shiftRadius = 0;
//     pieSeries.slices.template.states.getKey('hover').properties.scale = 0.9;
//
// // Add second series
//     const pieSeries2 = chart.series.push(new am4charts.PieSeries());
//     pieSeries2.dataFields.value = 'bottles';
//     pieSeries2.dataFields.category = 'country';
//     pieSeries2.slices.template.stroke = am4core.color('#fff');
//     pieSeries2.slices.template.strokeWidth = 2;
//     pieSeries2.slices.template.strokeOpacity = 1;
//     pieSeries2.slices.template.states.getKey('hover').properties.shiftRadius = 0;
//     pieSeries2.slices.template.states.getKey('hover').properties.scale = 1.1;
//
//   }

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
}
