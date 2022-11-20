import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { AirnodeDataService } from 'src/app/services/airnode-data/airnode-data.service';
import { DateCalculationService } from 'src/app/services/date-calculation.service';
import { GroupUserData } from 'src/interfaces/heatmap.interface';
import { mean, median } from 'src/utils/heatmap.utils';

@Component({
  selector: 'app-comp-chart',
  templateUrl: './comp-chart.component.html',
  styleUrls: ['./comp-chart.component.scss'],
})
export class CompChartComponent implements OnInit, OnDestroy {
  public chart!: Chart;
  @Input() chartID!: string;
  @Input() daysBack: number = 7;
  @Input() currentDay: boolean = true;
  @Input() aspectRatio: number = 2;
  @Input() dataType: string = 'users'; // or network_consumption
  dateFrom: string = this._dateCalc.getNowTimeStamp().firstOfDay;
  dateEnd!: string;
  totalDataList!: number[];
  uniqDateArray: string[] = [];
  groupDateData: GroupUserData = {};
  chartLineColor: string[] = [
    '#FF0000',
    '#FF7F00',
    '#FFFF00',
    '#00FF00',
    '#0000FF',
    '#4B0082',
    '#FF10F0',
  ];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public _aNodeData: AirnodeDataService,
    public _dateCalc: DateCalculationService
  ) {}

  ngOnInit(): void {
    this.uniqDateArray = [];

    this.dateFrom = this._dateCalc.getPreviousDay(
      this._dateCalc.getNowTimeStamp().firstOfDay,
      this.daysBack
    ).objFormated;

    this.dateEnd = this.currentDay
      ? this._dateCalc.getLastTimeStamp()
      : this._dateCalc.getNowTimeStamp().firstOfDay;

    this._aNodeData
      .getData(this.dateFrom, this.dateEnd)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        // Array of unique dates is needed to group the data
        // to display the multiline chart
        data.map((obj) => {
          if (
            obj.timestamp.slice(0, 10) !=
            this.uniqDateArray[this.uniqDateArray.length - 1]
          )
            this.uniqDateArray.push(obj.timestamp.slice(0, 10));

          this.totalDataList = data.map((obj) =>
            this.dataType == 'users'
              ? obj.users
              : this.dataType == 'network'
              ? obj.network_usage / (1024 * 1024 * 1024)
              : obj.airnodes
          );
        });

        // Object for multiline chart.
        this.uniqDateArray.map((uniqDate) => {
          this.groupDateData[uniqDate] = data.filter(
            ({ timestamp }) => timestamp.slice(0, 10) == uniqDate
          );
        });

        this.chart.data.labels = this.groupDateData[
          this.dateFrom.slice(0, 10)
        ].map((dataIn) => dataIn.timestamp.slice(10, 19));

        this.uniqDateArray.forEach((uniqDate, index) => {
          this.chart.data.datasets[index] = {
            label:
              index != this.uniqDateArray.length - 1
                ? uniqDate
                : `Today ${uniqDate}`,
            borderWidth:
              index != this.uniqDateArray.length - 1 ? 0.75 * (index + 1) : 8,
            type: 'line',
            pointStyle: 'dash',
            tension: 0.4,
            fill: false,
            //backgroundColor: 'rgba(208, 27, 108, 0.15)',
            borderColor: index == 7 ? '#08f7fe' : this.chartLineColor[index],
            data: this.groupDateData[uniqDate].map((dataIn) =>
              this.dataType == 'users'
                ? dataIn.users
                : this.dataType == 'network'
                ? dataIn.network_usage / (1024 * 1024 * 1024)
                : dataIn.airnodes
            ),
          };
        });

        // length of array: the lines come after data is displayed
        this.chart.data.datasets[this.uniqDateArray.length] = {
          label: 'Weekly Mean',
          borderWidth: 2,
          type: 'line',
          pointStyle: 'dash',
          tension: 0.4,
          fill: false,
          borderColor: '#9CFF2E',
          data: Array(96).fill(mean(this.totalDataList)),
          borderDash: [20, 20],
        };

        this.chart.data.datasets[this.uniqDateArray.length + 1] = {
          label: 'Weekly Median',
          borderWidth: 2,
          type: 'line',
          pointStyle: 'dash',
          tension: 0.4,
          fill: false,
          borderColor: '#FFFF00',
          data: Array(96).fill(median(this.totalDataList)),
          borderDash: [20, 20],
        };

        this.chart.data.datasets[this.uniqDateArray.length + 2] = {
          label: 'Weekly Max',
          borderWidth: 1,
          type: 'line',
          pointStyle: 'dash',
          tension: 0.4,
          fill: false,
          borderColor: 'red',
          data: Array(96).fill(Math.max(...this.totalDataList)),
          borderDash: [10, 10],
        };

        this.chart.data.datasets[this.uniqDateArray.length + 3] = {
          label: 'Weekly Min',
          borderWidth: 1,
          type: 'line',
          pointStyle: 'dash',
          tension: 0.4,
          fill: false,
          borderColor: 'blue',
          data: Array(96).fill(Math.min(...this.totalDataList)),
          borderDash: [10, 10],
        };

        this.chart.update();
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  createChart() {
    Chart.defaults.color = '#fff';
    this.chart = new Chart(this.chartID, {
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        aspectRatio: this.aspectRatio,
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
