import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexStates,
  ApexTheme,
  ApexTooltip,
  ApexForecastDataPoints,
  ApexFill,
  ApexAnnotations,
  ApexLegend,
  ApexMarkers,
  ApexNoData,
  ApexPlotOptions,
  ApexResponsive,
  ApexNonAxisChartSeries,
  ApexYAxis,
} from 'ng-apexcharts';

export interface ApexOptions {
  annotations?: ApexAnnotations;
  chart: ApexChart;
  colors: any[];
  dataLabels: ApexDataLabels;
  fill?: ApexFill;
  forecastDataPoints?: ApexForecastDataPoints;
  grid: ApexGrid;
  labels?: string[];
  legend: ApexLegend;
  markers?: ApexMarkers;
  noData?: ApexNoData;
  plotOptions: ApexPlotOptions;
  responsive?: ApexResponsive[];
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  states?: ApexStates;
  stroke?: ApexStroke;
  subtitle?: ApexTitleSubtitle;
  theme?: ApexTheme;
  title: ApexTitleSubtitle;
  tooltip?: ApexTooltip;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
}
