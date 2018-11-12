import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { QueryResponse } from '../../models/query-response.model'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() data: QueryResponse
  header: string[]
  constructor() { }

  ngOnInit() {
    this.header = this.data.columns
  }

  ngOnChanges() {
    this.header = this.data.columns
  }

}
