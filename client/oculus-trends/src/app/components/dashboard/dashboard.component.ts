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
  hrFourth: number
  hrHalf: number
  hrThird: number
  hrTwoThird: number
  hrThreeFourth: number
  vrFourth: number
  vrHalf: number
  vrThird: number
  vrTwoThird: number
  vrThreeFourth: number
  hrQuarters: number[]
  vrQuarters: number[]
  vrThirds: number[]
  hrThirds: number[]
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
    let quarterBase = []
    let thirdBase = []
    for (let i = 1; i <=3; i++) {
      quarterBase.push(i)
      if (i <= 2) {
        thirdBase.push(i)
      }
    } 

    this.hrQuarters = quarterBase.map(i => {
      return Math.round((this.screenHeight / 4) * i)
    })
    this.vrQuarters = quarterBase.map(i => {
      return Math.round((this.screenWidth / 4) * i)
    })

    this.hrThirds = thirdBase.map(i => {
      return Math.round((this.screenHeight / 3) * i)
    })

    this.vrThirds = thirdBase.map(i => {
      return Math.round((this.screenWidth / 3) * i)
    })
  }

  ngOnDestroy() {
    this.dashboardService.changeOnDashboard(false)
    window.removeEventListener('rsize', this.resizeListener)
  }

}
