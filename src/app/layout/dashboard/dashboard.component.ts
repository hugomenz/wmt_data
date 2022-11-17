import { Component, OnInit } from '@angular/core';
import { DateCalculationService } from 'src/app/services/date-calculation.service';
import { M_CHRT_TEXT } from '../../components/chart/main-chart-text.data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(public _dateCalc: DateCalculationService) {}
  mainChartTitle = M_CHRT_TEXT.chrtTitle;

  chartCurrentDayTitle =
    M_CHRT_TEXT.chrtCurrentDayTitle +
    '.  ' +
    this._dateCalc.getNowTimeStamp().standard;

  chartPreviousDayTitle =
    M_CHRT_TEXT.chrtPreviousDayTitle +
    '.  ' +
    this._dateCalc.getPreviousDay(this._dateCalc.getNowTimeStamp().noHour, 1)
      .title;

  ngOnInit(): void {}
}
