import { Injectable } from '@angular/core';
import { QueryResponse, ChartData } from '../models/query-response.model'
import { Chart } from '../models/chart.model'
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient, private globalService: GlobalService) { }

  toQueryResponse(data: object[]): QueryResponse {
    if (data.length > 0) {
      return {
        columns: Object.keys(data[0]), 
        rows: data
      }
    } else {
      return null
    }
  }

  toChartData(name, xAxis, yAxis, rows): ChartData {
    return {
      name: name, 
      xAxis: xAxis, 
      yAxis: yAxis, 
      rows: rows
    }
  }


  toColumn(data: ChartData) {
     let result = {
        "chart": {
            "caption": data.name,
            "xAxisName": data.xAxis,
            "yAxisName": data.yAxis,
            "theme": "fusion"
        },
        "data": data.rows.map(r => {
          return {
            "Label": r[data.xAxis], 
            "Value": r[data.yAxis]
          }
        })
    }
    return result
  }

  chartTypeDataMethod(chartType) {
    let mappings = {
      column: this.toColumn
    }
    return mappings[chartType]
  }

  chartTypeToId(chartType) {
    let chartIds = {
      table: 1, 
      column: 2
    }

    return chartIds[chartType]
  }

  chartTypeNameToId(chartTypeName) {
    let chartTypeNames = {
      1: 'table', 
      2: 'column'
    }
  }

  newChartSave(saveObj) {
    return this.http.post(this.globalService.apiUrl + 'chart', saveObj, {observe: 'response'})
  }

  toChartInterface(chart: object): Chart {
    return {
      id: chart['id'],
      name: chart['name'],
      chartTypeId: chart['chartTypeId'], 
      dasboardId: chart['dashboardId'], 
      dbcId: chart['dbcId'], 
      x: chart['x'], 
      y: chart['y'],
      height: chart['height'], 
      width: chart['width'], 
      query: chart['query'], 
      xAxis: chart['xAxis'],
      yAxis: chart['yAxis'],
      uuid: chart['uuid'], 
      options: chart['options']
    }
  }

  runQuery(chartInterface) {

  }

  runChart(chart: Chart, refresh: number = 0): Promise<object> {
    return new Promise((resolve, reject) => {
      let params = {
        refresh: refresh.toString()
      }
      this.http.get(this.globalService.apiUrl + `chart/${chart.id}/run`, {observe: 'response', params: params}).subscribe(response => {
        let rows = response.body['results']
        console.log(chart)
        let chartData = this.toChartData(chart.name, chart.xAxis, chart.yAxis, rows)
        let dataSource = this.toColumn(chartData)
        resolve(dataSource)
      }, 
      error => {
        reject(error)
      })
    })
  }

}
