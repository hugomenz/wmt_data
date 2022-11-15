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
import { DataCurrentDayService } from 'src/app/services/airnode-data/data-current-day.service';
import { DateCalculationService } from 'src/app/services/date-calculation.service';
import { M_CHRT_TEXT } from '../chart/main-chart-text.data';

@Component({
  selector: 'app-day-chart',
  templateUrl: './day-chart.component.html',
  styleUrls: ['./day-chart.component.scss'],
})
export class DayChartComponent implements OnInit, OnDestroy {
  @Input() chartID!: string;

  public chart!: Chart;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public _aNodeCurrentDay: DataCurrentDayService,
    public _dateCalc: DateCalculationService
  ) {}

  ngOnInit(): void {
    this.createChart();

    this._aNodeCurrentDay.userData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.chart.data.labels = data.map((dataIn) => dataIn.t.slice(0, -3));

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

        this.chart.update();
      });

    this._aNodeCurrentDay.networkData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.chart.data.labels = data.map((dataIn) => dataIn.t.slice(0, -3));

        this.chart.data.datasets[1] = {
          label: M_CHRT_TEXT.chrtLblNetwork,
          yAxisID: 'yAxis1',
          type: 'bar',
          backgroundColor: 'rgba(90, 35, 149, 0.7)',
          data: data.map((dataIn) => dataIn.network),
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
        };

        this.chart.update();
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
