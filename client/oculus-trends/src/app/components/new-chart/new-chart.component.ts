import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseConnectionInterface } from '../../models/account-overview.model';
import { QueryResponse, ChartData } from '../../models/query-response.model'
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../../services/dashboard.service';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-new-chart',
  templateUrl: './new-chart.component.html',
  styleUrls: ['./new-chart.component.css']
})
export class NewChartComponent implements OnInit {
  @ViewChild('formRef') formRef: ElementRef
  @ViewChild('chartPreviewRef') chartPreviewRef: ElementRef
  @ViewChild('chartNameRef') chartNameRef: ElementRef
  @ViewChild('dbcIdRef') dbcIdRef: ElementRef
  @ViewChild('queryRef') queryRef: ElementRef
  @ViewChild('chartTypeRef') chartTypeRef: ElementRef
  @ViewChild('xAxisRef') xAxisRef: ElementRef
  @ViewChild('yAxisRef') yAxisRef: ElementRef

  chartNameVal: String
  dbcIdVal: number
  queryVal: string
  chartTypeVal: string
  xAxisVal: string
  yAxisVal: string

  dashboardId: number
  dbcs: DatabaseConnectionInterface[]
  submitted: boolean = false
  queryTested: boolean = false
  showTable: boolean = false
  queryResponse: QueryResponse
  chartType: string = 'table'
  // xAxis: string = null
  // yAxis: string = null
  showAxesSelects = ['column']
  invalidAxis: boolean = false
  showChart = false
  chartData: ChartData
  dataSource: object

  constructor(private activatedRoute: ActivatedRoute, 
    private authService: AuthService, 
    private dashboardService: DashboardService, 
    private renderer: Renderer2, 
    private chartService: ChartService
  ) { }

  ngOnInit() {
    this.dashboardId = +this.activatedRoute.snapshot.paramMap.get('id')
    this.dbcs = this.authService.accountOverview.dbcs  
    let formRefHeight = getComputedStyle(this.formRef.nativeElement).height
    this.renderer.setStyle(this.chartPreviewRef.nativeElement, 'min-height', formRefHeight)
    console.log(typeof this.dbcIdRef.nativeElement.value)
  }

  runQuery(dbcIdRef, queryRef) {
    console.log(queryRef.value)
    this.dashboardService.runQuery(dbcIdRef.value, queryRef.value).subscribe(response => {
      console.log(response.body['results'])
      this.queryResponse = this.chartService.toQueryResponse(response.body['results'])
      this.showTable = true
    },  
    error => {
      console.log('There was an error testing the query')
    })
  }

  onChartTypeChange() {
    console.log(`Chart type is now ${this.chartType}`)
    this.onChartSettingChange()
    this.toChartData()
  }

  toChartData() {
    console.log('Converting to chart data')
    let data = {
      queryResponse: this.queryResponse, 
      xAxis: null, 
      yAxis: null
    }
    console.log(data)
  }

  onAxisChange(x, y) {
    console.log(`${x}, ${y}`)
  }

  onChartSettingChange() {
    if (this.chartNameRef.nativeElement.value) {
      this.chartNameVal = this.chartNameRef.nativeElement.value
    }
    if (this.dbcIdRef.nativeElement.value) {
      this.dbcIdVal = this.dbcIdRef.nativeElement.value
    }
    if (this.queryRef.nativeElement.value) {
      this.queryVal = this.queryRef.nativeElement.value
    }
    if (this.chartTypeRef.nativeElement.value) {
      this.chartTypeVal = this.chartTypeRef.nativeElement.value
    }
    if (this.xAxisRef && this.xAxisRef.nativeElement.value) {
      this.xAxisVal = this.xAxisRef.nativeElement.value
    }
    if (this.yAxisRef && this.yAxisRef.nativeElement.value) {
      this.yAxisVal = this.yAxisRef.nativeElement.value
    }

    if (this.chartNameVal && this.dbcIdVal && this.queryVal && (this.chartTypeVal != 'table') && this.xAxisVal && this.yAxisVal && this.queryResponse && this.checkInvalidAxis()) {
      this.chartData = this.chartService.toChartData(this.chartNameVal, this.xAxisVal, this.yAxisVal, this.queryResponse.rows)
      let transformMethod = this.chartService.chartTypeDataMethod(this.chartTypeVal)
      this.dataSource = transformMethod(this.chartData)
      this.showChart = true
    } else {
      this.showChart = false
    }
    
  }

  checkInvalidAxis(): boolean {
    console.log('Checking invalid axis')
    let yVals = this.queryResponse.rows.map(e => e[this.yAxisVal])
    let allNumeric = yVals.every(e => !isNaN(e))
    this.invalidAxis = allNumeric ? false : true
    return allNumeric
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
