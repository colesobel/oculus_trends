export interface Chart {
  id: number,
  name: string,
  chartTypeId: number, 
  dasboardId: number, 
  dbcId: number, 
  x: number, 
  y: number,
  height: number, 
  width: number, 
  query: string, 
  xAxis: string, 
  yAxis: string,
  uuid: string, 
  options: object
}