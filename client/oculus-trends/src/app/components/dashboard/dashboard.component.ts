import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { ChartService } from '../../services/chart.service';
import { Chart } from '../../models/chart.model'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardId: number
  noCharts: boolean = false
  charts: Chart[]

  screenWidth: number
  screenHeight: number
  hrHalf: number
  hrThird: number
  hrTwoThird: number
  vrHalf: number
  vrThird: number
  vrTwoThird: number
  showGridlines: boolean = false

  resizeListener: (event: MouseEvent) => void
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dashboardService: DashboardService, private chartService: ChartService) { }

  ngOnInit() {
    this.dashboardId = +this.activatedRoute.snapshot.paramMap.get('id')
    this.dashboardService.changeOnDashboard(true)
    this.dashboardService.getCharts(this.dashboardId).subscribe(response => {
      console.log('Success getting charts!')
      console.log(response)
      if (response.body['charts'].length > 0) {
        let charts = response.body['charts']
        this.charts = charts.map(this.chartService.toChartInterface)
      } else {
        this.noCharts = true
      }
    }, 
    error => {
      console.log('There was an error getting charts')
      console.log(error)
    })  
    this.resizeListener = () => {
      this.dashboardService.notifyWindowChange()
      this.setScreenDimensions()
    }
    window.addEventListener('resize', this.resizeListener)
    this.setScreenDimensions()
    this.dashboardService.showGridlines.subscribe(response => {
      this.showGridlines = response
    })
  }

  setScreenDimensions() {
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight - 60  // navbar height

    // gridlines
    this.hrHalf = Math.round(this.screenHeight / 2)
    this.hrThird = Math.round(this.screenHeight / 3)
    this.hrTwoThird = Math.round((this.screenHeight / 3) * 2)

    this.vrHalf = Math.round(this.screenWidth / 2)
    this.vrThird = Math.round(this.screenWidth / 3)
    this.vrTwoThird = Math.round((this.screenWidth / 3) * 2)

  }

  ngOnDestroy() {
    this.dashboardService.changeOnDashboard(false)
    window.removeEventListener('rsize', this.resizeListener)
  }

}
