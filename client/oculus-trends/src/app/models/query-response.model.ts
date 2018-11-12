export interface QueryData {
  columns: string[], 
  rows: object[]
}

export type QueryResponse = QueryData | null


export interface ChartData {
  name: string,
  xAxis: string, 
  yAxis: string, 
  rows: object[]
}