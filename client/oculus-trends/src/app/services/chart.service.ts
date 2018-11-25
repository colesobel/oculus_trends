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

  chartTypeIdToFriendlyName(chartTypeName) {
    let chartTypeNames = {
      1: 'table', 
      2: 'column'
    }
    return chartTypeNames[chartTypeName]
  }

  chartTypeIdToOfficialName(chartTypeId): string {
    let officialNames = {
      1: 'table', 
      2: 'column2d'
    }
    return officialNames[chartTypeId]
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

  onSizePlacementChange(chart: Chart, x: number, y: number, height: number, width: number, screenWidth: number, screenHeight: number): Promise<Chart> {
    let xPercentage = +(x / screenWidth).toFixed(3)
    let yPercentage = +(y / screenHeight).toFixed(3)
    let widthPercentage = +(width / screenWidth).toFixed(3)
    let heightPercentage = +(height / screenHeight).toFixed(3)

    return new Promise((resolve, reject) => {
      if (chart.x != xPercentage || chart.y != yPercentage || chart.height != heightPercentage || chart.width != widthPercentage) {
        console.log(`Save the specs for chart_id: ${chart.id}!`)
        let body = {
          x: xPercentage,
          y: yPercentage, 
          height: heightPercentage, 
          width: widthPercentage
        }
        this.http.put(this.globalService.apiUrl + `chart/${chart.id}/spec`, body, {observe: 'response'}).subscribe(response => {
          let chartResponse = response.body['result']
          resolve(chartResponse)
        }, 
        error => {
          console.log('Error in spec save')
          console.log(error)
          reject(null)
        })
      } else {
        reject(null)
      }
    })    
  }

  getById(id: number): Promise<Chart> {
    return new Promise((resolve, reject) => {
      this.http.get(this.globalService.apiUrl + `chart/${id}`, {observe: 'response'}).subscribe(response => {
        let chart = response.body['record']
        resolve(this.toChartInterface(chart))
      }, 
      error => {
        reject(error)
      })
    })
    
  }

}
