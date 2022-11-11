import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './layout/support/support.component';
import { AboutComponent } from './layout/about/about.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'support',
    component: SupportComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
