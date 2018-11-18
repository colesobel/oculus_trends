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
  chartTypeVal: string = 'table'
  xAxisVal: string
  yAxisVal: string
  
  dashboardId: number
  dbcs: DatabaseConnectionInterface[]
  submitted: boolean = false
  queryTested: boolean = false
  showTable: boolean = false
  queryResponse: QueryResponse
  showAxesSelects = ['column']
  invalidAxis: boolean = false
  showChart = false
  chartData: ChartData
  dataSource: object
  chartSavable: boolean = false

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
  }

  resetAxes() {
    console.log('resetting axes')
    if (this.queryResponse && this.xAxisVal && this.yAxisVal) {
      if (!this.queryResponse.columns.includes(this.xAxisVal)) {
        this.xAxisVal = undefined
      }
      if (!this.queryResponse.columns.includes(this.yAxisVal)) {
        this.yAxisVal = undefined
      }
    }
    
  }

  runQuery(dbcIdRef, queryRef) {
    console.log(queryRef.value)
    this.dashboardService.runQuery(dbcIdRef.value, queryRef.value).subscribe(response => {
      console.log(response.body['results'])
      this.queryResponse = this.chartService.toQueryResponse(response.body['results'])
      this.showTable = true
      this.chartSavable = true

      // Maybe remove??
      this.chartTypeVal = 'table'
      this.showChart = false
      this.resetAxes()
    },  
    error => {
      console.log('There was an error testing the query')
    })
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
    if (this.xAxisRef && this.xAxisRef.nativeElement.value != 'Select x Axis') {
      this.xAxisVal = this.xAxisRef.nativeElement.value
    }
    if (this.yAxisRef && this.yAxisRef.nativeElement.value != 'Select y Axis') {
      this.yAxisVal = this.yAxisRef.nativeElement.value
    }

    if (this.chartNameVal && this.dbcIdVal && this.queryVal && (this.chartTypeVal != 'table') && this.xAxisVal && this.yAxisVal && this.queryResponse && this.checkInvalidAxis()) {
      this.chartData = this.chartService.toChartData(this.chartNameVal, this.xAxisVal, this.yAxisVal, this.queryResponse.rows)
      let transformMethod = this.chartService.chartTypeDataMethod(this.chartTypeVal)
      this.dataSource = transformMethod(this.chartData)
      this.showChart = true
      this.chartSavable = true
    } else if (this.chartNameVal && this.dbcIdVal && this.queryVal && (this.chartTypeVal == 'table') && this.xAxisVal && this.yAxisVal && this.queryResponse) {
      this.showChart = false
      this.chartSavable = true
    } else {
      this.showChart = false
      this.chartSavable = false
    }
    
  }

  checkInvalidAxis(): boolean {
    console.log('Checking invalid axis')
    let yVals = this.queryResponse.rows.map(e => e[this.yAxisVal])
    let allNumeric = yVals.every(e => !isNaN(e))
    this.invalidAxis = allNumeric ? false : true
    return allNumeric
  }

  onSubmit() {
    console.log('Saving the chart!!')
    let saveObj = {
      dashboardId: this.dashboardId,
      name: this.chartNameVal,
      dbcId: this.dbcIdVal, 
      query: this.queryVal, 
      chartTypeId: this.chartService.chartTypeToId(this.chartTypeVal), 
      xAxis: this.xAxisVal, 
      yAxis: this.yAxisVal
    }

    this.chartService.newChartSave(saveObj).subscribe(response => {
      console.log('Chart Save Success!')
      console.log(response)
    }, 
    error => {
      console.log('There was an error')
      console.log(error)
    })


  }

  logIt() {
    console.log(this.chartNameVal)
    console.log(this.dbcIdVal)
    console.log(this.queryVal)
    console.log(this.chartTypeVal)
    console.log(this.xAxisVal)
    console.log(this.yAxisVal)
  }

}
