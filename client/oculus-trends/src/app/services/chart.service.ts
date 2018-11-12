import { Injectable } from '@angular/core';
import { QueryResponse, ChartData } from '../models/query-response.model'

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

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


}
