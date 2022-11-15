import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import Chart from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { AirnodeQueryDataService } from 'src/app/services/airnode-query-data.service';
import { DateCalculationService } from 'src/app/services/date-calculation.service';
import { HeatmapQueryDataService } from 'src/app/services/heatmap-query-data.service';
import { M_CHRT_TEXT } from '../chart/main-chart-text.data';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
})
export class HeatmapComponent implements OnInit, OnDestroy {
  @Input() chartID!: string;

  @ViewChild('', { static: true })
  startQueryTimeStamp!: string;
  endQueryTimeStamp!: string;
  public heatMap!: Chart;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public _heatQueryData: HeatmapQueryDataService,
    public _dateCalc: DateCalculationService
  ) {
    this.startQueryTimeStamp = this._dateCalc.getYesterdayFirstTimeStamp();
    this.endQueryTimeStamp = this._dateCalc.getNowTimeStamp().firstOfDay;

    this._heatQueryData.getData(
      this.startQueryTimeStamp,
      this.endQueryTimeStamp
    );
  }

  ngOnInit(): void {
    this.createChart();

    this._heatQueryData.userData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        /* console.log(
          '%cchart.component.ts line:26 data',
          'color: #007acc;',
          data
        ); */
        this.heatMap.data.labels = data.map((dataIn) => dataIn.t.slice(0, -3));

        this.heatMap.data.datasets[0] = {
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

        this.heatMap.update();
      });

    this._heatQueryData.networkData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        /* console.log(
          '%cchart.component.ts line:72 data',
          'color: #007acc;',
          data
        ); */

        this.heatMap.data.labels = data.map((dataIn) => dataIn.t.slice(0, -3));

        this.heatMap.data.datasets[1] = {
          label: M_CHRT_TEXT.chrtLblNetwork,
          yAxisID: 'yAxis1',
          type: 'bar',
          backgroundColor: 'rgba(90, 35, 149, 0.7)',
          data: data.map((dataIn) => dataIn.network),
        };

        this.heatMap.options.scales = {
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

        this.heatMap.update();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  createChart() {
    this.heatMap = new Chart('heatMap', {
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

    Chart.defaults.color = '#fff';
  }
}
