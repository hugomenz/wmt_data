import { Component, OnInit } from '@angular/core';
import { M_CHRT_TEXT } from '../../components/chart/main-chart-text.data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor() {}
  mainChartTitle = M_CHRT_TEXT.chrtTitle;

  ngOnInit(): void {}
}
