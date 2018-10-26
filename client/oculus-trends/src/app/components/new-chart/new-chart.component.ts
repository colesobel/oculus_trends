import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseConnectionInterface } from '../../models/account-overview.model';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-new-chart',
  templateUrl: './new-chart.component.html',
  styleUrls: ['./new-chart.component.css']
})
export class NewChartComponent implements OnInit {
  dashboardId: number
  dbcs: DatabaseConnectionInterface[]
  submitted: boolean = false
  queryTested: boolean = false
  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService, private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardId = +this.activatedRoute.snapshot.paramMap.get('id')
    this.dbcs = this.authService.accountOverview.dbcs  
  }

  runQuery(dbcIdRef, queryRef) {
    console.log(queryRef.value)
    this.dashboardService.runQuery(dbcIdRef.value, queryRef.value).subscribe(response => {
      console.log(response)
    },  
    error => {
      console.log('There was an error testing the query')
    })
  }

  // onSubmit(form: NgForm) {
  //   // this.submitted = true
  //   if (!this.queryTested) {
  //     this.dashboardService.testQuery(this.dashboardId, form.value).subscribe(response => {
  //       this.queryTested = true
  //       console.log('success')
        
  //     },
  //     error => {
  //       console.log('There was an error when running the query. Please verify the query syntax.')
  //     })
  //   }
  //   console.log(form.value)
  // }

}
