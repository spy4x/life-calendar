import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {ViewType} from '../+shared/types/view.type';


interface Year {
  title: string;
  months: { title: string, passed: boolean }[];
}

@Component({
  selector: 'lc-calendar',
  templateUrl: './calendar.component.pug',
  styleUrls: ['./calendar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnChanges {

  @Input() yearOfBirth: number;
  @Input() yearsToLife: number;
  @Input() view: ViewType;
  years: Year[];
  today = new Date();

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['yearOfBirth'] || changes['yearOfBirth'])
      && this.yearOfBirth
      && this.yearsToLife) {
      this.years = this.generateYears(this.yearOfBirth, this.yearsToLife, this.today);
    }
  }

  private generateYears(yearOfBirth: number, yearsToLife: number, today: Date): Year[] {
    const yearOfDeath = yearOfBirth + yearsToLife;
    const years: Year[] = [];
    for (let year = yearOfBirth; year <= yearOfDeath; year++) {
      const yearItem: Year = {
        title: year + '',
        months: []
      };
      for (let month = 1; month <= 12; month++) {
        yearItem.months.push({
          title: month + '',
          passed: today > new Date(`${year}-${month}-31`)
        });
      }
      years.push(yearItem);
    }
    return years;
  }
}
