import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartService } from '../../services/chart.service';
import { Chart } from '../../models/chart.model';
import { AuthService } from '../../services/auth.service';
import { QueryResponse } from '../../models/query-response.model';

@Component({
  selector: 'app-chart-edit',
  templateUrl: './chart-edit.component.html',
  styleUrls: ['./chart-edit.component.css']
})
export class ChartEditComponent implements OnInit {

  chartId: number
  chart: Chart
  accountOverview
  queryResponse: QueryResponse
  chartName: string

  constructor(private activatedRoute: ActivatedRoute, private chartService: ChartService, private authService: AuthService) { }

  ngOnInit() {
    this.chartId = this.activatedRoute.snapshot.params['id']

    this.chartService.getById(this.chartId).then(response => {
      this.chart = response
      this.chartName = this.chartService.chartTypeIdToFriendlyName(this.chart.chartTypeId)
      console.log(this.chart)
    }, 
    error => {
      console.log('There was an error getting the chart')
      console.log(error)
    })

    this.chartService.getQueryResults(this.chartId).then(response => {
      this.queryResponse = response
    }, 
    error => {
      console.log('There was an error fetching query')
      console.log(error)
    })

    this.accountOverview = this.authService.accountOverview
  }

}
