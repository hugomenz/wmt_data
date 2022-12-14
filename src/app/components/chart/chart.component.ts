import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AirnodeDataService } from '../../services/airnode-data/airnode-data.service';

import Chart, { layouts } from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { M_CHRT_TEXT } from '../../../utils/chartText.utils';
import { DateCalculationService } from 'src/app/services/date-calculation.service';
import {
  getLastTimeStamp,
  getNowTimeStamp,
  getPreviousDay,
} from 'src/utils/date-format.utils';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() chartID: string = 'main';
  @Input() daysBack: number = 7;
  @Input() currentDay: boolean = false;
  @Input() aspectRatio: number = 2;
  @Input() lineTension: number = 0.2; // 0 - 1
  //dateFrom!: string;
  dateFrom: string = getNowTimeStamp().firstOfDay;
  dateEndBefore!: string;

  dataUsers: number[] = [];
  dataNetwork: number[] = [];
  chartLabelData: string[] = [];

  public chart!: Chart;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public _aNodeData: AirnodeDataService) {}

  ngOnInit(): void {
    this.dateFrom = getPreviousDay(
      getNowTimeStamp().firstOfDay,
      this.daysBack
    ).objFormated;

    this.dateEndBefore = this.currentDay
      ? getLastTimeStamp()
      : getNowTimeStamp().firstOfDay;

    this._aNodeData
      .getData(this.dateFrom, this.dateEndBefore)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dataUsers = data.map((element) => element.users);
        this.dataNetwork = data.map(
          (element) => element.network_usage / (1024 * 1024 * 1024)
        );
        this.chart.data.labels = data.map((element) =>
          element.timestamp.slice(0, -3)
        );

        this.chart.data.datasets[0] = {
          label: M_CHRT_TEXT.chrtLblUsers,
          yAxisID: 'yAxis0',
          type: 'line',
          pointStyle: 'dash',
          tension: this.lineTension,
          fill: true,
          backgroundColor: 'rgba(208, 27, 108, 0.15)',
          borderColor: '#FD7E14',
          data: this.dataUsers,
        };
        this.chart.data.datasets[1] = {
          label: M_CHRT_TEXT.chrtLblNetwork,
          yAxisID: 'yAxis1',
          type: 'line',
          pointStyle: 'dash',
          tension: this.lineTension,
          fill: true,
          backgroundColor: 'rgba(90, 35, 149, 0.2)',
          borderColor: 'rgba(245,26,116, 0.2)',
          data: this.dataNetwork,
        };

        /* this.chart.data.datasets[1] = {
          label: M_CHRT_TEXT.chrtLblNetwork,
          yAxisID: 'yAxis1',
          type: 'bar',
          backgroundColor: 'rgba(90, 35, 149, 0.7)',
          data: data.map(
            (dataIn) => dataIn.network_usage / (1024 * 1024 * 1024)
          ),
        }; */

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
