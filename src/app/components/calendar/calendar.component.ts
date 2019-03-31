import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ViewType } from '../../types/view.type';


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
export class CalendarComponent implements OnChanges {
  @Input() yearOfBirth: number;
  @Input() yearsToLife: number;
  @Input() yearOfDeath: number;
  @Input() age: number;
  @Input() percentageLivedSoFar: number;
  @Input() view: ViewType;
  @Input() today: Date;
  years: Year[];

  ngOnChanges(changes: SimpleChanges): void {
    // tslint:disable-next-line:no-string-literal
    if ((changes['yearOfBirth'] || changes['yearOfBirth']) && this.yearOfBirth && this.yearsToLife) {
      this.years = this.generateYears();
    }
  }

  private generateYears(): Year[] {
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

  getAge50Year() {
    return this.yearOfBirth + 50;
  }
}
