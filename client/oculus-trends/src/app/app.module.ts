import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpClient } from '@angular/common/http'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AppRootComponent } from './components/app-root/app-root.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeDefaultComponent } from './components/home-default/home-default.component';
import { CookieService } from 'ngx-cookie-service';
import { DefaultNavbarComponent } from './components/default-navbar/default-navbar.component';
import { CustomNavbarComponent } from './components/custom-navbar/custom-navbar.component';
import { AuthInterceptor } from './shared/auth.interceptor';
import { GlobalService } from './services/global.service';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';
import { AccountComponent } from './components/account/account.component';
import { NewDbConnectionComponent } from './components/new-db-connection/new-db-connection.component';
import { AccountDefaultComponent } from './components/account-default/account-default.component';
import { EditDbConnectionComponent } from './components/edit-db-connection/edit-db-connection.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChartComponent } from './components/chart/chart.component';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import { DashboardsComponent } from './components/dashboards/dashboards.component';
import { DashboardsDefaultComponent } from './components/dashboards-default/dashboards-default.component';
import { NewDashboardComponent } from './components/new-dashboard/new-dashboard.component';
import { NewChartComponent } from './components/new-chart/new-chart.component';
import { TableComponent } from './components/table/table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChartEditComponent } from './components/chart-edit/chart-edit.component';
import { ChartEditResolver } from './components/chart-edit/chart-edit-resolver';
import { NewUserComponent } from './components/new-user/new-user.component';

FusionChartsModule.fcRoot(FusionCharts, Charts)


// function initialize(authService: AuthService, globalService: GlobalService, http: HttpClient) {
//   return () => {
//     let token = authService.getCookie(globalService.tokenKey)
//     if (token) {
//       authService.getAccountOverview()
//     } else {
//       authService.initializationComplete = true
//     }
//   }
// }

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AppRootComponent,
    SignupComponent,
    LoginComponent,
    HomeDefaultComponent,
    DefaultNavbarComponent,
    CustomNavbarComponent,
    AccountComponent,
    NewDbConnectionComponent,
    AccountDefaultComponent,
    EditDbConnectionComponent,
    DashboardComponent,
    ChartComponent,
    DashboardsComponent,
    DashboardsDefaultComponent,
    NewDashboardComponent,
    NewChartComponent,
    TableComponent,
    ChartEditComponent,
    NewUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule, 
    HttpClientModule, 
    FusionChartsModule, 
    BrowserAnimationsModule, 
    MatTooltipModule
  ],
  providers: [
    CookieService, 
    // { provide: APP_INITIALIZER, useFactory: initialize, deps: [AuthService, GlobalService, HttpClient], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 
    ChartEditResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
