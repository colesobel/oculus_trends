import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-navbar',
  templateUrl: './custom-navbar.component.html',
  styleUrls: ['./custom-navbar.component.css']
})
export class CustomNavbarComponent implements OnInit, OnDestroy{
  onDashboard: boolean = false
  onDashboardSubscription: Subscription

  constructor(private authService: AuthService, private router: Router, private dashboardService: DashboardService) { }

  ngOnInit() {
    this.onDashboardSubscription = this.dashboardService.onDashboardChange.subscribe((onDash: boolean) => {
      this.onDashboard = onDash
    }) 
  }

  onLogOut() {
    this.authService.logOut()
  }

  logAccountOverview() {
    console.log(this.authService.accountOverview)
    console.log(this.authService.authenticated)
    console.log(this.authService.initializationComplete)
  }

  onNewChart() {
    console.log(this.router.url)
    this.router.navigate([this.router.url, 'new-chart'])
  }

  ngOnDestroy() {
    this.onDashboardSubscription.unsubscribe()
  }
}
