import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs';
import { ChartService } from '../../services/chart.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ChartEditResolver implements Resolve<object> {
  constructor(private chartService: ChartService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): object {
    let chartId = +route.params['id']
    // return this.chartService.getById(chartId)
    return {hey: 'gurl'}
  }
}