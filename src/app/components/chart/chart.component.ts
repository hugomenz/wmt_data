import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AirnodeDataService } from '../../services/airnode-data/airnode-data.service';

import Chart, { layouts } from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { M_CHRT_TEXT } from './main-chart-text.data';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() chartID!: string;
  public chart!: Chart;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public _aNodeData: AirnodeDataService) {}

  ngOnInit(): void {
    this.createChart();
    this._aNodeData.userData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        //console.log(data);
        this.chart.data.labels = data.map((dataIn) => dataIn.t.slice(0, -3));

        this.chart.data.datasets[0] = {
          label: M_CHRT_TEXT.chrtLblUsers,
          yAxisID: 'yAxis0',
          type: 'line',
          pointStyle: 'dash',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(208, 27, 108, 0.15)',
          borderColor: '#FD7E14',
          data: data.map((dataIn) => dataIn.users),
        };

        this.chart.update();
      });

    this._aNodeData.networkData
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

        this.chart.options = {
          scales: {
            yAxis0: {
              grid: { display: false },
              beginAtZero: false,
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
