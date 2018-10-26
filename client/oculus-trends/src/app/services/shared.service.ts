import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { DatabaseConnectionFormInterface } from '../models/dbConn-form.model'
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient, private globalService: GlobalService) { }

  submitDatabaseConnection(formData: DatabaseConnectionFormInterface) {
    return this.http.post(
      this.globalService.apiUrl + 'db_conn', 
      formData, 
      {observe: 'response'}
    )
  }
}
