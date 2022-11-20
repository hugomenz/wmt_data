import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { AirnodeDataService } from 'src/app/services/airnode-data/airnode-data.service';
import { DateCalculationService } from 'src/app/services/date-calculation.service';
import {
  CoordinateHeat,
  GroupUserData,
  HeatData,
} from 'src/interfaces/heatmap.interface';
import { ApexOptions } from 'src/interfaces/ng-apex.interface';
import { heatMapGetIntervalData } from 'src/utils/heatmap.utils';
import { AirNodes } from '../../../interfaces/data-firestore.interface';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
})
export class HeatmapComponent implements OnInit {
  @Input() daysBack: number = 7;
  @Input() currentDay: boolean = true;
  @Input() dataType: string = 'users'; // or network
  dateFrom: string = this._dateCalc.getNowTimeStamp().firstOfDay;
  dateEnd!: string;
  dateFromPrevious!: string;

  totalDataList!: number[];
  maxTotalData!: number;
  minTotalData!: number;
  uniqDateArray: string[] = [];
  groupDateData: GroupUserData = {};
  heatDataSeries: HeatData[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  newOgDataArray!: AirNodes[];

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ApexOptions> = {} as Partial<ApexOptions>;

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
      .getData(
        this._dateCalc.getPreviousDay(this.dateFrom, 1).last,
        this.dateEnd
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        // Array of unique dates is needed to group the data
        // to display the multiline chart
        this.totalDataList = [];
        this.newOgDataArray = [];
        this.uniqDateArray = [];
        //
        data.map((obj, index, arr) => {
          if (index != 0) {
            this.newOgDataArray.push({
              airnodes: obj.airnodes,
              timestamp: obj.timestamp,
              network_usage:
                ((arr[index].network_usage - arr[index - 1].network_usage) /
                  arr[index - 1].network_usage) *
                100,
              users:
                ((arr[index].users - arr[index - 1].users) /
                  arr[index - 1].users) *
                100,
            });

            this.dataType == 'users'
              ? this.totalDataList.push(
                  ((arr[index].users - arr[index - 1].users) /
                    arr[index - 1].users) *
                    100
                )
              : this.dataType == 'network'
              ? this.totalDataList.push(
                  ((arr[index].network_usage - arr[index - 1].network_usage) /
                    arr[index - 1].network_usage) *
                    100
                )
              : '';
          }
        });

        this.newOgDataArray.map((obj) => {
          if (
            obj.timestamp.slice(0, 10) !=
            this.uniqDateArray[this.uniqDateArray.length - 1]
          )
            this.uniqDateArray.push(obj.timestamp.slice(0, 10));
        });

        this.heatDataSeries = [];
        // Object for multiline chart.
        this.uniqDateArray.map((uniqDate) => {
          this.groupDateData[uniqDate] = this.newOgDataArray.filter(
            ({ timestamp }) => timestamp.slice(0, 10) == uniqDate
          );

          this.heatDataSeries.push({
            name: uniqDate.toString(),
            data: this.groupDateData[uniqDate].map((obj) => {
              return {
                x: obj.timestamp.slice(11, 16),
                y:
                  this.dataType == 'users'
                    ? obj.users
                    : this.dataType == 'network'
                    ? obj.network_usage
                    : 0, /// (1024 * 1024 * 1024),
              };
            }),
          });
        });

        this.maxTotalData = Math.max(...this.totalDataList);
        this.minTotalData = Math.min(...this.totalDataList);

        this.chartOptions = {
          chart: { height: 500, type: 'heatmap' },

          dataLabels: { enabled: false },
          grid: {
            show: false,
            xaxis: {
              lines: {
                show: false,
              },
            },
            yaxis: {
              lines: {
                show: false,
              },
            },
          },
          plotOptions: {
            heatmap: {
              shadeIntensity: 0.5,
              distributed: true,
              colorScale: {
                ranges: heatMapGetIntervalData(
                  this.minTotalData,
                  this.maxTotalData
                ),
              },
            },
          },
          legend: { show: false },
          series: this.heatDataSeries,
          title: { text: 'HeatMap Chart with Color Range' },
        };
      });
  }
}
