import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './components/home/home.component';
import { AppRootComponent } from './components/app-root/app-root.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeDefaultComponent } from './components/home-default/home-default.component';
import { AccountComponent } from './components/account/account.component'
import { AuthGuard } from './shared/auth.guard';
import { AccountDefaultComponent } from './components/account-default/account-default.component';
import { NewDbConnectionComponent } from './components/new-db-connection/new-db-connection.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardsComponent } from './components/dashboards/dashboards.component';
import { DashboardsDefaultComponent } from './components/dashboards-default/dashboards-default.component';
import { NewDashboardComponent } from './components/new-dashboard/new-dashboard.component';
import { NewChartComponent } from './components/new-chart/new-chart.component';

const routes: Routes = [
  {
    path: 'app', 
    component: AppRootComponent, 
    canActivate: [AuthGuard],
    children: [
      {
        path: 'account', 
        component: AccountComponent, 
        children: [
          {path: 'db-connection/new', component: NewDbConnectionComponent},
          {path: '', component: AccountDefaultComponent}
        ]
      }, 
      {path: 'dashboard/:id/:dashboardName', component: DashboardComponent}, 
      {path: 'dashboard/:id/:dashboardName/new-chart', component: NewChartComponent}, 
      {path: 'dashboards', 
      component: DashboardsComponent, 
      children: [
        {path: 'new', component: NewDashboardComponent},
        {path: '', component: DashboardsDefaultComponent}
      ]}, 
    ]
  },
  {
    path: '',
    component: HomeComponent, 
    children: [
      {path: 'signup', component: SignupComponent}, 
      {path: 'login', component: LoginComponent}, 
      {path: '', component: HomeDefaultComponent}
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
