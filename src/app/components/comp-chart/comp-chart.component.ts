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

type GroupUserData = {
  [key: string]: AirNodes[];
};

@Component({
  selector: 'app-comp-chart',
  templateUrl: './comp-chart.component.html',
  styleUrls: ['./comp-chart.component.scss'],
})
export class CompChartComponent implements OnInit, OnDestroy {
  @Input() chartID: string = 'comp';
  @Input() daysBack: number = 7;
  @Input() currentDay: boolean = true;
  @Input() aspectRatio: number = 2;
  //dateFrom!: string;
  dateFrom: string = this._dateCalc.getNowTimeStamp().firstOfDay;
  dateEnd!: string;

  chartLineColor: string[] = [
    '#ff6961',
    '#ffb480',
    '#f8f38d',
    '#42d6a4',
    '#08cad1',
    '#59adf6',
    '#9d94ff',
    '#FFFF00',
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
        // I need a
        data.map((obj) => {
          if (
            obj.timestamp.slice(0, 10) !=
            this.uniqDateArray[this.uniqDateArray.length - 1]
          )
            this.uniqDateArray.push(obj.timestamp.slice(0, 10));
        });

        //console.log(this.uniqDateArray);

        this.uniqDateArray.map((uniqDate) => {
          this.groupDateData[uniqDate] = data.filter(
            ({ timestamp }) => timestamp.slice(0, 10) == uniqDate
          );
          this.chart.data.labels = this.groupDateData[
            this.dateFrom.slice(0, 10)
          ].map((dataIn) => dataIn.timestamp.slice(10, 19));
        });

        /* this.chart.data.labels = this.groupDateData[uniqDate].map(
          (dataIn) => dataIn.timestamp
        ); */

        this.uniqDateArray.forEach((uniqDate, index) => {
          this.chart.data.datasets[index] = {
            label: uniqDate,
            //yAxisID: 'yAxis0',
            type: 'line',
            pointStyle: 'dash',
            tension: 0.4,
            fill: false,
            //backgroundColor: 'rgba(208, 27, 108, 0.15)',
            borderColor: this.chartLineColor[index],
            data: this.groupDateData[uniqDate].map((dataIn) => dataIn.users),
          };
        });

        /* this.chart.data.datasets[1] = {
          label: M_CHRT_TEXT.chrtLblNetwork,
          yAxisID: 'yAxis1',
          type: 'bar',
          backgroundColor: 'rgba(90, 35, 149, 0.7)',
          data: data.map(
            (dataIn) => dataIn.network_usage / (1024 * 1024 * 1024)
          ),
        }; */

        /* this.chart.options.scales = {
          yAxis0: {
            grid: { display: false },
            //beginAtZero: false,
            //min: 13000,
            position: 'right',
            title: {
              display: true,
              text: M_CHRT_TEXT.chrtAxisUsers,
            },
            ticks: { font: { size: 12 } },
          },
          yAxis1: {
            grid: { display: false },
            beginAtZero: false,
            //min: 950,
            position: 'left',
            title: {
              display: true,
              text: M_CHRT_TEXT.chrtAxisNetwork,
            },
            ticks: { font: { size: 12 } },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 } },
          },
        }; */

        this.chart.update();
      });

    //this._aNodeData.getData('10-11-2022 00:00:00');

    /* this._aNodeData.userData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        // I need a
        data.map((obj) => {
          if (
            obj.t.slice(0, 10) !=
            this.uniqDateArray[this.uniqDateArray.length - 1]
          )
            this.uniqDateArray.push(obj.t.slice(0, 10));
        });

        this.uniqDateArray.map((uniqDate) => {
          this.groupDateData[uniqDate] = data.filter(
            ({ t }) => t.slice(0, 10) == uniqDate
          );
        });
        //console.log(this.uniqDateArray);
        console.log(this.groupDateData); */

    /*       this.chart.data.labels = data.map((dataIn) => dataIn.t.slice(0, -3));

        this.chart.data.datasets[0] = {
          label: M_CHRT_TEXT.chrtLblUsers,
          yAxisID: 'yAxis0',
          type: 'line',
          pointStyle: 'dash',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(208, 27, 108, 0.15)',
          //backgroundColor: 'rgba(253, 126, 23, 0.08)',
          borderColor: '#FD7E14',
          data: data.map((dataIn) => dataIn.users),
        };
        this.chart.options.scales = {
          yAxis0: {
            grid: { display: false },
            //beginAtZero: false,
            //min: 13000,
            position: 'right',
            title: {
              display: true,
              text: M_CHRT_TEXT.chrtAxisUsers,
            },
            ticks: { font: { size: 12 } },
          },
        };
        this.chart.update();
      }); */
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
        aspectRatio: 2.5,
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
