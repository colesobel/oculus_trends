import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { DashboardService } from '../../services/dashboard.service';
import { DashboardInterface } from '../../models/account-overview.model'
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.css']
})
export class NewDashboardComponent implements OnInit {
  submitted: boolean = false

  constructor(private dashboardService: DashboardService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onDashboardSubmit(form: NgForm) {
    this.submitted = true
    this.dashboardService.createDashboard(form.value).subscribe((dashboard: DashboardInterface) => {
      let dash = dashboard['record'] as DashboardInterface
      this.authService.updateDashboards(dash)
      this.router.navigate(['app', 'dashboard', dash.id, dash.urlAlias])

      console.log(dash)
    }, 
    error => {
      console.log('there was an error with dashboard creation')
    })
  }

}
