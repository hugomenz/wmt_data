import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayChartComponent } from './day-chart.component';

describe('DayCahrtComponent', () => {
  let component: DayChartComponent;
  let fixture: ComponentFixture<DayChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DayChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
