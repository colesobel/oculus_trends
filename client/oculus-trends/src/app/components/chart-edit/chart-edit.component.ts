import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartService } from '../../services/chart.service';
import { Chart } from '../../models/chart.model';

@Component({
  selector: 'app-chart-edit',
  templateUrl: './chart-edit.component.html',
  styleUrls: ['./chart-edit.component.css']
})
export class ChartEditComponent implements OnInit {

  chartId: number
  chart: Chart

  constructor(private activatedRoute: ActivatedRoute, private chartService: ChartService) { }

  ngOnInit() {
    this.chartId = this.activatedRoute.snapshot.params['id']
    this.chartService.getById(this.chartId).then(response => {
      this.chart = response
      console.log(this.chart)
    }, 
    error => {
      console.log('There was an error getting the chart')
      console.log(error)
    })
  }

}
