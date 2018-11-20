import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs'
import { GlobalService } from './global.service';

export interface DashboardInterface {
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  onDashboard: boolean = false
  onDashboardChange = new Subject<boolean>()
  onWindowChange = new Subject<void>()

  constructor(private http: HttpClient, private globalService: GlobalService) { }

  createDashboard(formData: DashboardInterface) {
    console.log(formData)
    return this.http.post(this.globalService.apiUrl + 'dashboard', formData)
  }

  changeOnDashboard(onDash: boolean) {
    this.onDashboard = onDash
    this.onDashboardChange.next(this.onDashboard)
  }

  runQuery(dbcId: number, query: string) {

    return this.http.post(this.globalService.apiUrl + 'chart-test', {dbcId: dbcId, query: query}, {observe: 'response'})
  }

  getCharts(dashboardId: number) {
    return this.http.get(this.globalService.apiUrl + `dashboard/${dashboardId}/charts`, {observe: 'response'})
  }

  notifyWindowChange() {
    this.onWindowChange.next()
  }
}
