import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { LayoutModule } from '@angular/cdk/layout';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { SupportComponent } from './layout/support/support.component';
import { AboutComponent } from './layout/about/about.component';
import { FooterComponent } from './layout/footer/footer.component';

import { CardComponent } from './components/card/card.component';

import { ChartComponent } from './components/chart/chart.component';
import { DayChartComponent } from './components/day-chart/day-chart.component';

import { AngularFireModule } from '@angular/fire/compat';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularMaterialModule } from './angular-material.module';
import { LastDayChartComponent } from './components/last-day-chart/last-day-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    CardComponent,
    DashboardComponent,
    ToolbarComponent,
    FooterComponent,
    SupportComponent,
    AboutComponent,
    DayChartComponent,
    LastDayChartComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    LayoutModule,
    NgxChartsModule,
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
/* function initializeApp(firebase: {
  projectId: string;
  appId: string;
  storageBucket: string;
  locationId: string;
  apiKey: string;
  authDomain: string;
  messagingSenderId: string;
  measurementId: string;
}) {
  throw new Error('Function not implemented.');
} */
