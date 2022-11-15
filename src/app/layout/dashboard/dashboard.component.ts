import { Component, OnInit } from '@angular/core';
import { AirnodeQueryDataService } from 'src/app/services/airnode-query-data.service';
import { DateCalculationService } from 'src/app/services/date-calculation.service';
import { M_CHRT_TEXT } from '../../components/chart/main-chart-text.data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    public _queryANodeData: AirnodeQueryDataService,
    public _dateCalc: DateCalculationService
  ) {}
  mainChartTitle = M_CHRT_TEXT.chrtTitle;

  chart24Title =
    M_CHRT_TEXT.chrt24Title + '.  ' + this._dateCalc.getNowTimeStamp().standard;

  ngOnInit(): void {}
}
