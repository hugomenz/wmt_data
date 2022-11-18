import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import Chart from 'chart.js/auto';
import {
  BehaviorSubject,
  forkJoin,
  observable,
  Observable,
  Observer,
  Subject,
  takeUntil,
} from 'rxjs';
import { AirnodeDataService } from 'src/app/services/airnode-data/airnode-data.service';
import { DateCalculationService } from 'src/app/services/date-calculation.service';
import { AirNodes, Users } from 'src/interfaces/data-firestore.interface';
import { M_CHRT_TEXT } from '../chart/main-chart-text.data';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { ChartOptions } from 'chart.js';
import { line } from 'd3';
import { mean, median } from './helpers';

type GroupUserData = {
  [key: string]: AirNodes[];
};

@Component({
  selector: 'app-comp-chart',
  templateUrl: './comp-chart.component.html',
  styleUrls: ['./comp-chart.component.scss'],
})
export class CompChartComponent implements OnInit, OnDestroy {
  @Input() chartID!: string;
  @Input() daysBack: number = 7;
  @Input() currentDay: boolean = true;
  @Input() aspectRatio: number = 2;
  @Input() dataType: string = 'users'; // or network_consumption

  //dateFrom!: string;
  dateFrom: string = this._dateCalc.getNowTimeStamp().firstOfDay;
  dateEnd!: string;

  nDataList!: number[];

  chartLineColor: string[] = [
    '#FF0000',
    '#FF7F00',
    '#FFFF00',
    '#00FF00',
    '#0000FF',
    '#4B0082',
    '#FF10F0',
  ];

  public chart!: Chart;

  destroy$: Subject<boolean> = new Subject<boolean>();

  uniqDateArray: string[] = [];
  groupDateData: GroupUserData = {};
  testArray: string[] = [];

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

    console.log(`comp-chart: ${this.dateFrom} -- ${this.dateEnd}`);

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
        });

        // Object for multiline chart.
        this.uniqDateArray.map((uniqDate) => {
          this.groupDateData[uniqDate] = data.filter(
            ({ timestamp }) => timestamp.slice(0, 10) == uniqDate
          );
          this.chart.data.labels = this.groupDateData[
            this.dateFrom.slice(0, 10)
          ].map((dataIn) => dataIn.timestamp.slice(10, 19));
        });

        // Weekly mean
        this.nDataList = data.map((obj) =>
          this.dataType == 'users'
            ? obj.users
            : this.dataType == 'network'
            ? obj.network_usage / (1024 * 1024 * 1024)
            : obj.airnodes
        );

        this.uniqDateArray.forEach((uniqDate, index) => {
          console.log('---------------');
          console.log(index);
          console.log(uniqDate);
          console.log(this.chartLineColor[index]);
          console.log(
            'index!=this.uniqDateArray.length - 1',
            index != this.uniqDateArray.length - 1
          );

          this.chart.data.datasets[index] = {
            label:
              index != this.uniqDateArray.length - 1
                ? uniqDate
                : `Today ${uniqDate}`,

            //yAxisID: 'yAxis0',
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
          console.log('----after dataset');
          console.log(uniqDate);
          console.log(this.chartLineColor[index]);
        });

        // length of array: the lines come after data is displayed
        this.chart.data.datasets[this.uniqDateArray.length] = {
          label: 'Weekly Mean',
          //yAxisID: 'yAxis0',
          borderWidth: 2,
          type: 'line',
          pointStyle: 'dash',
          tension: 0.4,
          fill: false,
          //backgroundColor: 'rgba(208, 27, 108, 0.15)',
          borderColor: '#9CFF2E',
          data: Array(96).fill(mean(this.nDataList)),
          borderDash: [20, 20],
        };

        this.chart.data.datasets[this.uniqDateArray.length + 1] = {
          label: 'Weekly Median',
          //yAxisID: 'yAxis0',
          borderWidth: 2,
          type: 'line',
          pointStyle: 'dash',
          tension: 0.4,
          fill: false,
          //backgroundColor: 'rgba(208, 27, 108, 0.15)',
          borderColor: '#FFFF00',
          data: Array(96).fill(median(this.nDataList)),
          borderDash: [20, 20],
        };

        this.chart.data.datasets[this.uniqDateArray.length + 2] = {
          label: 'Weekly Max',
          //yAxisID: 'yAxis0',
          borderWidth: 1,
          type: 'line',
          pointStyle: 'dash',
          tension: 0.4,
          fill: false,
          //backgroundColor: 'rgba(208, 27, 108, 0.15)',
          borderColor: 'red',
          data: Array(96).fill(Math.max(...this.nDataList)),
          borderDash: [10, 10],
        };

        this.chart.data.datasets[this.uniqDateArray.length + 3] = {
          label: 'Weekly Min',
          //yAxisID: 'yAxis0',
          borderWidth: 1,
          type: 'line',
          pointStyle: 'dash',
          tension: 0.4,
          fill: false,
          //backgroundColor: 'rgba(208, 27, 108, 0.15)',
          borderColor: 'red',
          data: Array(96).fill(Math.min(...this.nDataList)),
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
