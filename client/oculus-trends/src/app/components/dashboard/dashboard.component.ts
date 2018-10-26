import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardId: number
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardId = +this.activatedRoute.snapshot.paramMap.get('id')
    console.log(this.dashboardId)
    this.dashboardService.changeOnDashboard(true)
  }

  ngOnDestroy() {
    this.dashboardService.changeOnDashboard(false)
  }

}
