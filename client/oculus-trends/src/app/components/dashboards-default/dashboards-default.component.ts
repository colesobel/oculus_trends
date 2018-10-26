import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'
import { AuthService } from '../../services/auth.service'
import { DashboardInterface, AccountOverviewInterface } from '../../models/account-overview.model'

@Component({
  selector: 'app-dashboards-default',
  templateUrl: './dashboards-default.component.html',
  styleUrls: ['./dashboards-default.component.css']
})
export class DashboardsDefaultComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }
  dashboards: DashboardInterface[]
  accountOverviewSubscription: Subscription

  ngOnInit() {
    this.dashboards = this.authService.accountOverview.dashboards
    this.accountOverviewSubscription = this.authService.accountOverviewChanged.subscribe((overview: AccountOverviewInterface) => {
      console.log('got a new value from account overview')
      this.dashboards = overview.dashboards
    })
  }

  ngOnDestroy() {
    this.accountOverviewSubscription.unsubscribe()
  }

}
