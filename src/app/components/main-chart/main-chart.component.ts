import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.scss'],
})
export class MainChartComponent implements OnInit {
  saleData = [
    { name: 'Mobiles', value: 105000 },
    { name: 'Laptop', value: 55000 },
    { name: 'AC', value: 15000 },
    { name: 'Headset', value: 150000 },
    { name: 'Fridge', value: 20000 },
  ];

  constructor() {}

  ngOnInit(): void {}
}
