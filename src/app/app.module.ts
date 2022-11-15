import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { ChartComponent } from './components/chart/chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';

import { FooterComponent } from './layout/footer/footer.component';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { SupportComponent } from './layout/support/support.component';
import { AboutComponent } from './layout/about/about.component';
import { DayChartComponent } from './components/day-chart/day-chart.component';
import { HeatmapComponent } from './components/heatmap/heatmap.component';
import { MainChartComponent } from './components/main-chart/main-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
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
    HeatmapComponent,
    MainChartComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    AppRoutingModule,
    NgxChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
