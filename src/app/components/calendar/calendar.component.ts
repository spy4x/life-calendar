import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ViewType } from '../../types/view.type';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

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
  @Input() lifeExpectancy: number;
  @Input() yearOfDeath: number;
  @Input() age: number;
  @Input() percentageLivedSoFar: number;
  @Input() view: ViewType;
  @Input() today: Date;
  years: Year[];

  ngOnChanges(changes: SimpleChanges): void {
    const thus = this;
    if ((changes.yearOfBirth || changes.lifeExpectancy || changes.view) && this.yearOfBirth && this.lifeExpectancy) {
      this.years = this.generateYears();
      if (this.view === 'radialBar') {
        setTimeout(() => {
          this.drawChart.apply(thus);
        });
      }
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

  // noinspection JSMethodCanBeStatic
  private drawChart() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    const chart = am4core.create('chartdiv', am4charts.RadarChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
      // {
      //   category: 'One',
      //   value1: 8,
      //   value2: 2,
      //   value3: 4,
      //   value4: 3,
      // },
      // {
      //   category: 'Two',
      //   value1: 11,
      //   value2: 4,
      //   value3: 2,
      //   value4: 4,
      // },
      // {
      //   category: 'Three',
      //   value1: 7,
      //   value2: 6,
      //   value3: 6,
      //   value4: 2,
      // },
      // {
      //   category: 'Four',
      //   value1: 13,
      //   value2: 8,
      //   value3: 3,
      //   value4: 2,
      // },
      {
        category: '',
        value1: 0,
        //   value2: 10,
        //   value3: 5,
        //   value4: 1,
      },
      {
        category: 'JESUS',
        value1: 15,
        value2: 12,
        value3: 4,
        // value4: 4,
      },
      {
        category: 'YOU',
        value1: this.age,
        value2: (50 - this.age),
        value3: this.lifeExpectancy - 50,
        // value4:this.lifeExpectancy - 50,
      },
    ];

    // chart.padding(20, 20, 20, 20);
    chart.colors.step = 4;

    // @ts-ignore
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.labels.template.location = 0.5;
    categoryAxis.renderer.labels.template.horizontalCenter = 'right';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.tooltipLocation = 0.5;
    categoryAxis.renderer.grid.template.strokeOpacity = 0.07;
    categoryAxis.renderer.axisFills.template.disabled = true;
    categoryAxis.interactionsEnabled = false;
    categoryAxis.renderer.minGridDistance = 10;

    // @ts-ignore
    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.labels.template.horizontalCenter = 'left';
    valueAxis.min = 0;
    valueAxis.max = this.lifeExpectancy + 10;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.maxLabelPosition = 0.99;
    valueAxis.renderer.minGridDistance = 10;
    valueAxis.renderer.grid.template.strokeOpacity = 0.07;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.interactionsEnabled = false;

    const series1 = chart.series.push(new am4charts.RadarColumnSeries());
    series1.columns.template.tooltipText = '{name}: {valueX.value}';
    series1.name = 'Series 1';
    series1.dataFields.categoryY = 'category';
    series1.dataFields.valueX = 'value1';
    series1.stacked = true;

    const series2 = chart.series.push(new am4charts.RadarColumnSeries());
    series2.columns.template.tooltipText = '{name}: {valueX.value}';
    series2.name = 'Series 2';
    series2.dataFields.categoryY = 'category';
    series2.dataFields.valueX = 'value2';
    series2.stacked = true;

    const series3 = chart.series.push(new am4charts.RadarColumnSeries());
    series3.columns.template.tooltipText = '{name}: {valueX.value}';
    series3.name = 'Series 3';
    series3.dataFields.categoryY = 'category';
    series3.dataFields.valueX = 'value3';
    series3.stacked = true;

    const series4 = chart.series.push(new am4charts.RadarColumnSeries());
    series4.columns.template.tooltipText = '{name}: {valueX.value}';
    series4.name = 'Series 4';
    series4.dataFields.categoryY = 'category';
    series4.dataFields.valueX = 'value4';
    series4.stacked = true;

    chart.seriesContainer.zIndex = -1;

    chart.cursor = new am4charts.RadarCursor();
    chart.cursor.lineY.disabled = true;
  }

}
