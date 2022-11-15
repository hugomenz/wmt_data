import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastDayChartComponent } from './last-day-chart.component';

describe('LastDayChartComponent', () => {
  let component: LastDayChartComponent;
  let fixture: ComponentFixture<LastDayChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastDayChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastDayChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
