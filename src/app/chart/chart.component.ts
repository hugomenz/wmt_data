import { Component, OnDestroy, OnInit } from '@angular/core';
import { AirnodeDataService } from '../services/airnode-data.service';

import Chart from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { TEXT } from 'src/assets/text.data';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  public chart!: Chart;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(public _aNodeData: AirnodeDataService) {}

  ngOnInit(): void {
    this.createChart();

    this._aNodeData.userData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log(
          '%cchart.component.ts line:26 data',
          'color: #007acc;',
          data
        );
        this.chart.data.labels = data.map((dataIn) => dataIn.t.slice(0, -3));
        this.chart.data.datasets[0] = {
          type: 'line',
          label: TEXT.chrtLblUsers,
          data: data.map((dataIn) => dataIn.users),
          yAxisID: 'yAxis0',
          borderColor: '#FD7E14',
          fill: true,
          pointStyle: 'line',
        };

        this.chart.update();
      });

    this._aNodeData.networkData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log(
          '%cchart.component.ts line:26 data',
          'color: #007acc;',
          data
        );

        this.chart.data.labels = data.map((dataIn) => dataIn.t.slice(0, -3));
        this.chart.data.datasets[1] = {
          type: 'bar',
          label: TEXT.chrtLblNetwork,
          data: data.map((dataIn) => dataIn.network),
          yAxisID: 'yAxis1',
          backgroundColor: 'rgba(203, 175, 253, 0.2)',
        };
        this.chart.options.scales = {
          yAxis0: {
            position: 'left',
            title: {
              display: true,
              text: TEXT.chrtAxisUsers,
            },
          },
          yAxis1: {
            position: 'right',
            title: {
              display: true,
              text: TEXT.chrtAxisNetwork,
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
    this.chart = new Chart('MyChart', {
      type: 'line', //this denotes tha type of chart
      data: {
        //labels: this.users.map((data) => data.t),
        labels: [],
        datasets: [],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
